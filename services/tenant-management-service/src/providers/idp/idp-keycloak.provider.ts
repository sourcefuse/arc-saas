import { Provider, ValueOrPromise } from "@loopback/context";
import axios from 'axios';
import qs from 'qs';
import { ConfigureIdpFunc, IdpDetails } from "../../types";

interface TokenResponse {
  access_token: string;
}

interface Credentials {
  type: string;
  value: string;
  temporary: boolean;
}

export class KeycloakIdpProvider implements Provider<ConfigureIdpFunc<void>>{
    constructor(){}

    value(): ConfigureIdpFunc<void> {
        return (payload)=>this.configure(payload);
    }
    async configure(payload: IdpDetails): Promise<void> {
      const { tenant } = payload;
      
      try {
        const token=await this.authenticateAdmin();
        // 1. Create a new realm using the tenant key
        await this.createRealm(tenant.key,token);
    
        // 2. Create a new client within the realm
        const clientId = `client-${tenant.key}`; // You can customize this as needed
        await this.createClient(tenant.key, clientId,token);
    
        // 3. Create a new admin user for the tenant
        const adminUsername = `${tenant.key}-admin`; // Customize this as needed
        const adminPassword = 'your-secure-password'; // This can be dynamic or set in the environment
        await this.createUser(tenant.key, adminUsername, adminPassword,token);
    
        console.log(`Successfully configured Keycloak for tenant: ${tenant.name}`);
      } catch (error) {
        console.error(`Error configuring Keycloak for tenant: ${tenant.name}`, error);
        throw new Error(`Failed to configure Keycloak for tenant: ${tenant.name}`);
      }
    }
    



  async  authenticateAdmin(): Promise<string> {
    const response = await axios.post<TokenResponse>(
        `${process.env.KEYCLOAK_HOST}/realms/master/protocol/openid-connect/token`,
        qs.stringify({
          username: process.env.KEYCLOAK_ADMIN_USERNAME,
          password: process.env.KEYCLOAK_ADMIN_PASSWORD,
          grant_type: 'password',
          client_id: 'admin-cli',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
    );
  
    return response.data.access_token;
  }

  async  createRealm(realmName: string,token:string): Promise<void> {
    // const token = await this.authenticateAdmin();
  
    const response = await axios.post(
      `${process.env.KEYCLOAK_HOST}/admin/realms`,
      {
        realm: realmName,
        enabled: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    console.log('Realm created:', response.data);
  }

  async  createClient(realmName: string, clientId: string,token:string): Promise<void> {
    // const token = await this.authenticateAdmin();
  
    const response = await axios.post(
      `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/clients`,
      {
        clientId: clientId,
        publicClient: true,
        directAccessGrantsEnabled: true,
        protocol: 'openid-connect',
        enabled: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    console.log('Client created:', response.data);
  }

  async  createUser(realmName: string, username: string, password: string,token:string): Promise<void> {
    // const token = await this.authenticateAdmin();
  
    const response = await axios.post(
      `${process.env.KEYCLOAK_HOST}/admin/realms/${realmName}/users`,
      {
        username: username,
        enabled: true,
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
      }
    );
  
    console.log('User created:', response.data);
  }


}


