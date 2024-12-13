import {Provider} from '@loopback/context';
import axios from 'axios';
import qs from 'qs';
import {ConfigureIdpFunc, IdpDetails, IdpResp} from '../../types';
import AWS from 'aws-sdk';
import {randomBytes} from 'crypto';

interface TokenResponse {
  // eslint-disable-next-line
  access_token: string;
}

export class KeycloakIdpProvider
  implements Provider<ConfigureIdpFunc<IdpResp>>
{
  ssm: AWS.SSM;

  constructor() {
    this.ssm = new AWS.SSM({region: process.env.AWS_REGION});
  }

  value(): ConfigureIdpFunc<IdpResp> {
    return payload => this.configure(payload);
  }

  async configure(payload: IdpDetails): Promise<IdpResp> {
    const {tenant, plan} = payload;

    try {
      const token = await this.authenticateAdmin();

      // Fetch the clientId, clientSecret, and realmName from AWS SSM
      const clientId = await this.getParameterFromSSM(
        `/${process.env.NAMESPACE}/${process.env.ENVIRONMENT}/${plan.tier.toLowerCase()}/${tenant.key}/keycloak-client-id`,
      );
      const clientSecret = await this.getParameterFromSSM(
        `/${process.env.NAMESPACE}/${process.env.ENVIRONMENT}/${plan.tier.toLowerCase()}/${tenant.key}/keycloak-client-secret`,
      );
      const realmName = await this.getParameterFromSSM(
        `/${process.env.NAMESPACE}/${process.env.ENVIRONMENT}/${plan.tier.toLowerCase()}/${tenant.key}/keycloak-client-realm`,
      );

      // Handling the logic based on tenant tier
      if (plan.tier === 'PREMIUM') {
        // For PREMIUM: always create a new realm
        await this.createRealm(realmName ?? tenant.key, token);
      } else if (plan.tier === 'STANDARD' || plan.tier === 'BASIC') {
        // For STANDARD or BASIC: check if the realm exists
        const realmExists = await this.realmExists(
          realmName ?? tenant.key,
          token,
        );
        if (!realmExists) {
          // If the realm does not exist, create it
          await this.createRealm(realmName ?? tenant.key, token);
        }
      }

      // Set up SMTP settings in the realm for AWS SES
      await this.setupEmailSettings(realmName ?? tenant.key, token);

      // Create a new client within the realm
      await this.createClient(
        realmName ?? tenant.key,
        clientId,
        token,
        clientSecret,
        tenant.key,
      );

      // Create a new admin user for the tenant
      const adminUsername = tenant.contacts[0].email;
      const passwordLength = 20;
      const adminPassword = this.generateStrongPassword(passwordLength);
      const {firstName, lastName, email} = tenant.contacts[0];

      const user = await this.createUser(
        realmName ?? tenant.key,
        adminUsername,
        adminPassword,
        firstName,
        lastName,
        email,
        token,
      );

      return {
        authId: user.id,
      };
    } catch (error) {
      throw new Error(
        `Failed to configure Keycloak for tenant: ${tenant.name}`,
      );
    }
  }

  // Method to check if a realm exists
  async realmExists(realmName: string, token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // If the realm exists, a successful response is returned (status code 200)
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If a 404 is returned, it means the realm doesn't exist
        return false;
      }
      // Rethrow any other errors
      throw new Error(`Error checking realm existence: ${error.message}`);
    }
  }

  // Method to authenticate as Keycloak Admin
  async authenticateAdmin(): Promise<string> {
    const response = await axios.post<TokenResponse>(
      `${process.env.KEYCLOAK_HOST}/realms/master/protocol/openid-connect/token`,
      qs.stringify({
        username: process.env.KEYCLOAK_ADMIN_USERNAME,
        password: process.env.KEYCLOAK_ADMIN_PASSWORD,
        // eslint-disable-next-line
        grant_type: 'password',
        // eslint-disable-next-line
        client_id: 'admin-cli',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.access_token;
  }

  async createRealm(realmName: string, token: string): Promise<void> {
    try {
      await axios.post(
        `${process.env.KEYCLOAK_HOST}/admin/realms`,
        {
          realm: realmName,
          enabled: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`Realm '${realmName}' created successfully.`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        console.error(
          `Error creating realm: ${error.response?.data || error.message}`,
        );
      } else {
        // Generic error handling
        console.error(`An unexpected error occurred: ${error.message}`);
      }
      throw new Error(
        `Failed to create realm '${realmName}': ${error.message}`,
      );
    }
  }

  // Method to set up AWS SES SMTP settings in the realm
  async setupEmailSettings(realmName: string, token: string): Promise<void> {
    try {
      await axios.put(
        `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}`,
        {
          smtpServer: {
            auth: true,
            starttls: true, // Enables TLS
            host: process.env.AWS_SES_SMTP_HOST, // Example: email-smtp.us-east-1.amazonaws.com
            port: '587', // Use port 587 for TLS
            user: process.env.AWS_SES_SMTP_USERNAME, // Your AWS SES SMTP username
            password: process.env.AWS_SES_SMTP_PASSWORD, // Your AWS SES SMTP password
            from: process.env.SMTP_FROM_EMAIL, // The "from" email address, e.g. 'no-reply@yourdomain.com'
            fromDisplayName: process.env.SMTP_FROM_DISPLAY_NAME, // The display name, e.g. 'Your Company Name'
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`SMTP settings updated for realm '${realmName}'.`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error setting up email settings: ${error.response?.data || error.message}`,
        );
      } else {
        console.error(
          `An unexpected error occurred while setting up email settings: ${error.message}`,
        );
      }
      throw new Error(
        `Failed to set up email settings for realm '${realmName}': ${error.message}`,
      );
    }
  }
  // Method to create a new Keycloak client
  async createClient(
    realmName: string,
    clientId: string,
    token: string,
    clientSecret: string,
    key: string,
  ): Promise<void> {
    try {
      const redirectUris = [
        'http://localhost:3000/*',
        `https://${key}.${process.env.DOMAIN_NAME}/authentication-service/*`,
      ];

      await axios.post(
        `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/clients`,
        {
          clientId: clientId,
          publicClient: false, // Must be false for client authentication
          secret: clientSecret,
          directAccessGrantsEnabled: true,
          protocol: 'openid-connect',
          enabled: true,
          redirectUris: redirectUris,
          clientAuthenticatorType: 'client-secret', // Enable client authentication
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(
        `Client '${clientId}' created successfully in realm '${realmName}'.`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        console.error(
          `Error creating client: ${error.response?.data || error.message}`,
        );
      } else {
        // Handle generic error
        console.error(`An unexpected error occurred: ${error.message}`);
      }
      throw new Error(
        `Failed to create client '${clientId}' in realm '${realmName}': ${error.message}`,
      );
    }
  }

  // Method to create a new Keycloak user
  async createUser(
    realmName: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    token: string,
  ): Promise<{id: string}> {
    try {
      const createUserResponse = await axios.post(
        `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/users`,
        {
          username: username,
          enabled: true,
          firstName: firstName,
          lastName: lastName,
          email: email,
          emailVerified: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: true, // Set password as temporary
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const locationHeader = createUserResponse.headers['location'];
      if (!locationHeader) {
        throw new Error(
          "User creation failed, no 'Location' header in response.",
        );
      }

      const userId = locationHeader.split('/').pop();
      if (!userId) {
        throw new Error(
          "User creation failed, could not extract user ID from 'Location' header.",
        );
      }

      // Send the password reset email
      await this.sendPasswordResetEmail(realmName, userId, token);

      console.log(
        `User '${username}' created successfully with ID '${userId}'.`,
      );
      return {id: userId};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        console.error(
          `Error creating user: ${error.response?.data || error.message}`,
        );
      } else {
        // Handle generic error
        console.error(`An unexpected error occurred: ${error.message}`);
      }
      throw new Error(
        `Failed to create user '${username}' in realm '${realmName}': ${error.message}`,
      );
    }
  }

  // Method to send a password reset email
  async sendPasswordResetEmail(
    realmName: string,
    userId: string,
    token: string,
  ): Promise<void> {
    try {
      await axios.put(
        `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/users/${userId}/execute-actions-email`,
        ['UPDATE_PASSWORD'],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(
        `Password reset email sent to user '${userId}' in realm '${realmName}'.`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        console.error(
          `Error sending password reset email: ${error.response?.data || error.message}`,
        );
      } else {
        // Handle generic error
        console.error(`An unexpected error occurred: ${error.message}`);
      }
      throw new Error(
        `Failed to send password reset email for user '${userId}' in realm '${realmName}': ${error.message}`,
      );
    }
  }

  // Helper function to fetch parameters from AWS SSM with error handling
  async getParameterFromSSM(parameterName: string): Promise<string> {
    try {
      const response = await this.ssm
        .getParameter({Name: parameterName, WithDecryption: true})
        .promise();
      return response.Parameter?.Value ?? '';
    } catch (error) {
      console.error(`Error fetching parameter ${parameterName}:`, error);
      // Optionally, you can throw the error or return a default value
      throw new Error(`Failed to fetch parameter ${parameterName}`);
    }
  }

  generateStrongPassword(length: number): string {
    const regex = /[A-Za-z0-9!@#$%^&*()_+~`|}{[\]:;?><,./-=]/; //NOSONAR
    const validChars: string[] = [];

    const ASCII_PRINTABLE_START = 33;

    const ASCII_PRINTABLE_END = 126;

    for (let i = ASCII_PRINTABLE_START; i <= ASCII_PRINTABLE_END; i++) {
      const char = String.fromCharCode(i);
      if (regex.test(char)) {
        validChars.push(char);
      }
    }
    const randomBytesArray = randomBytes(length);
    const password = Array.from(randomBytesArray)
      .map(byte => validChars[byte % validChars.length])
      .join('');
    return password;
  }
}
