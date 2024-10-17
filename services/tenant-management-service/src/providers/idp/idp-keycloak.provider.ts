import {Provider} from '@loopback/context';
import axios from 'axios';
import qs from 'qs';
import {ConfigureIdpFunc, IdpDetails, IdpResp} from '../../types';

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
  constructor() {}

  value(): ConfigureIdpFunc<IdpResp> {
    return payload => this.configure(payload);
  }
  async configure(payload: IdpDetails): Promise<IdpResp> {
    const {tenant} = payload;

    try {
      const token = await this.authenticateAdmin();
      // 1. Create a new realm using the tenant key
      await this.createRealm(tenant.key, token);

      // 2. Create a new client within the realm
      const clientId = `client-${tenant.key}`; // You can customize this as needed
      const clientSecret = `client-${tenant.key}-secret`;
      await this.createClient(tenant.key, clientId, token, clientSecret);

      // 3. Create a new admin user for the tenant
      const adminUsername = tenant.contacts[0].email; // Customize this as needed
      const adminPassword = tenant.key; // This can be dynamic or set in the environment
      const {firstName, lastName, email} = tenant.contacts[0];

      const user = await this.createUser(
        tenant.key,
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

  async createClient(
    realmName: string,
    clientId: string,
    token: string,
    clientSecret: string, // Accept client secret as a parameter
  ): Promise<void> {
    const redirectUris = [
      'http://localhost:3000/*', // Example: Local development redirect URI
      'https://your-app.com/*', // Example: Production redirect URI
      // Add other allowed URIs here
    ];

    await axios.post(
      `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/clients`,
      {
        clientId: clientId,
        publicClient: false, // Must be false for client authentication
        secret: clientSecret, // Use the provided client secret
        directAccessGrantsEnabled: true,
        protocol: 'openid-connect',
        enabled: true,
        redirectUris: redirectUris, // Add redirect URIs here
        clientAuthenticatorType: 'client-secret', // Enable client authentication
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  async createUser(
    realmName: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    token: string,
  ): Promise<{id: string}> {
    // Create the user in Keycloak
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
            temporary: false,
          },
        ] as Credentials[],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Extract the user ID from the 'Location' header of the response
    const locationHeader = createUserResponse.headers['location'];
    const userId = locationHeader.split('/').pop();

    // Return the user ID and the user information
    return {
      id: userId,
    };
  }
}
