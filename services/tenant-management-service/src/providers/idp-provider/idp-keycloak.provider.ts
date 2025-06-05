import {Provider} from '@loopback/context';
import axios from 'axios';
import qs from 'qs';
import {ConfigureIdpFunc, IdpDetails, IdpResp} from '../../types';
import AWS from 'aws-sdk';
import {randomBytes} from 'crypto';
import {AnyObject} from '@loopback/repository';
import {Plan} from '../../enums/plan-tier.enum';
import {Status} from '../../enums/status.enum';

const DEFAULT_PASSWORD_LENGTH = 20;
const ASCII_PRINTABLE_START = 32;
const ASCII_PRINTABLE_END = 126;
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

      await this._setupRealm(plan.tier, realmName ?? tenant.key, token);
      await this.setupEmailSettings(realmName ?? tenant.key, token);

      // Create a new client within the realm
      await this.createClient(
        realmName ?? tenant.key,
        clientId,
        token,
        clientSecret,
        tenant.key,
      );

      const user = await this._createAdminUser(
        tenant,
        realmName ?? tenant.key,
        token,
      );

      return {
        authId: user.id,
      };
    } catch (error) {
      throw new Error(
        `Failed to configure Keycloak for tenant: ${tenant.name},error: ${error.message}`,
      );
    }
  }

  /**
   * The _setupRealm function creates a new realm if the tier is PREMIUM, or checks if the realm exists
   * and creates it if it doesn't for STANDARD or BASIC tiers.
   * @param {string} tier - Tier specifies the level of service or plan for the realm, such as
   * 'PREMIUM', 'STANDARD', or 'BASIC'.
   * @param {string} realmName - The `realmName` parameter is a string that represents the name of the
   * realm that needs to be set up.
   * @param {string} token - The `token` parameter is used for authentication purposes. It is a
   * security token that grants access to the necessary resources for creating or checking the
   * existence of a realm. This token is typically provided by the user or system initiating the setup
   * of the realm and is used to authenticate the requests made to the realm
   */
  private async _setupRealm(
    tier: string,
    realmName: string,
    token: string,
  ): Promise<void> {
    if (tier === Plan.PREMIUM) {
      // For PREMIUM: always create a new realm
      await this.createRealm(realmName, token);
    } else if (tier === Plan.STANDARD || tier === Plan.BASIC) {
      // For STANDARD or BASIC: check if the realm exists
      const realmExists = await this.realmExists(realmName, token);
      if (!realmExists) {
        // If the realm does not exist, create it
        await this.createRealm(realmName, token);
      }
    } else {
      throw new Error(
        `Unsupported tier: ${tier}. Only PREMIUM, STANDARD, and BASIC are supported.`,
      );
    }
  }

  /**
   * The _createAdminUser function generates a strong password for an admin user and creates the user in
   * a specified realm.
   * @param {any} tenant - The `tenant` parameter is an object containing information about a tenant,
   * including an array of contacts. The function retrieves the email, first name, last name, and other
   * details of the first contact in the contacts array to create an admin user for that tenant.
   * @param {string} realmName - The `realmName` parameter in the `_createAdminUser` function refers to
   * the name of the realm in which the admin user will be created. It is a string value that specifies
   * the realm within which the user account will be managed.
   * @param {string} token - The `token` parameter in the `_createAdminUser` function is likely a
   * security token or authentication token that is used to authorize the creation of the admin user. It
   * is passed as a parameter to the function to ensure that the user creating the admin user has the
   * necessary permissions or rights to do so
   * @returns The `_createAdminUser` function is returning a Promise that resolves to an object with a
   * property `id` of type string.
   */
  private async _createAdminUser(
    tenant: AnyObject,
    realmName: string,
    token: string,
  ): Promise<{id: string}> {
    const adminUsername = tenant.contacts[0].email;
    const adminPassword = this.generateStrongPassword(
      Number(process.env.PASSWORD_LENGTH) || DEFAULT_PASSWORD_LENGTH,
    );
    const {firstName, lastName, email} = tenant.contacts[0];

    return this.createUser(
      realmName,
      adminUsername,
      adminPassword,
      firstName,
      lastName,
      email,
      token,
    );
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
      return response.status === Status.OK;
    } catch (error) {
      if (error.response && error.response.status === Status.NOT_FOUND) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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

      return {id: userId};
    } catch (error) {
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
    } catch (error) {
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
      // Optionally, you can throw the error or return a default value
      throw new Error(
        `Failed to fetch parameter ${parameterName},error: ${error.message}`,
      );
    }
  }

  generateStrongPassword(length: number): string {
    const regex = /[A-Za-z0-9!@#$%^&*()_+~`|}{[\]:;?><,./-=]/; //NOSONAR
    const validChars: string[] = [];

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
