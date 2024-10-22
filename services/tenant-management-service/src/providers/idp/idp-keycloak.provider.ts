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

interface Credentials {
  type: string;
  value: string;
  temporary: boolean;
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
    const {tenant} = payload;

    try {
      const token = await this.authenticateAdmin();

      // Fetch the clientId, clientSecret, and realmName from AWS SSM
      const clientId = await this.getParameterFromSSM(
        `/${tenant.namespace}/${tenant.environment}/${tenant.key}/keycloak-client-id`,
      );
      const clientSecret = await this.getParameterFromSSM(
        `/${tenant.namespace}/${tenant.environment}/${tenant.key}/keycloak-client-secret`,
      );
      const realmName = await this.getParameterFromSSM(
        `/${tenant.namespace}/${tenant.environment}/${tenant.key}/keycloak-client-realm`,
      );

      // 1. Create a new realm using the tenant key
      await this.createRealm(realmName ?? tenant.key, token);

      // 2. Set up SMTP settings in the realm for AWS SES
      await this.setupEmailSettings(realmName ?? tenant.key, token);

      // 2. Create a new client within the realm
      await this.createClient(
        realmName ?? tenant.key,
        clientId,
        token,
        clientSecret,
      );

      // 4. Create a new admin user for the tenant
      const adminUsername = tenant.contacts[0].email;

      const passwordLength = 20;
      const adminPassword = this.generateStrongPassword(passwordLength); // This can be dynamic or set in the environment
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
  }

  // Method to set up AWS SES SMTP settings in the realm
  async setupEmailSettings(realmName: string, token: string): Promise<void> {
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
  }

  // Method to create a new Keycloak client
  async createClient(
    realmName: string,
    clientId: string,
    token: string,
    clientSecret: string,
  ): Promise<void> {
    const redirectUris = [
      'http://localhost:3000/*', // Example: Local development redirect URI
      'https://your-app.com/*',
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
        ] as Credentials[],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const locationHeader = createUserResponse.headers['location'];
    const userId = locationHeader.split('/').pop();

    // Send the password reset email
    await this.sendPasswordResetEmail(realmName, userId!, token);

    return {id: userId};
  }

  // Method to send a password reset email
  async sendPasswordResetEmail(
    realmName: string,
    userId: string,
    token: string,
  ): Promise<void> {
    await axios.put(
      `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/users/${userId}/execute-actions-email`,
      ['UPDATE_PASSWORD'],
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  // Helper function to fetch parameters from AWS SSM
  async getParameterFromSSM(parameterName: string): Promise<string> {
    const response = await this.ssm
      .getParameter({Name: parameterName, WithDecryption: true})
      .promise();
    return response.Parameter?.Value ?? '';
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
