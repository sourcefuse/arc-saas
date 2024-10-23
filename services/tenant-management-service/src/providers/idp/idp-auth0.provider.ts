import {Provider} from '@loopback/context';

import {ConfigureIdpFunc, IdpDetails, IdPKey, IdpResp} from '../../types';
import {ManagementClient, PostOrganizationsRequest, UserCreate} from 'auth0';
import {repository} from '@loopback/repository';
import {randomBytes} from 'crypto';
import {HttpErrors} from '@loopback/rest';
import {TenantMgmtConfigRepository} from '../../repositories';

const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
export class Auth0IdpProvider implements Provider<ConfigureIdpFunc<IdpResp>> {
  management: ManagementClient;

  constructor(
    @repository(TenantMgmtConfigRepository)
    private readonly tenantConfigRepository: TenantMgmtConfigRepository,
  ) {}

  value(): ConfigureIdpFunc<IdpResp> {
    return payload => this.configure(payload);
  }
  async configure(payload: IdpDetails): Promise<IdpResp> {
    this.management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN ?? '',
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      audience: process.env.AUTH0_AUDIENCE,
    });
    const tenant = payload.tenant;
    const planTier = payload.plan.tier;
    const tenantConfig = await this.tenantConfigRepository.find({
      where: {tenantId: tenant.id, configKey: IdPKey.AUTH0},
    });
    if (!tenantConfig) {
      throw new HttpErrors.NotFound(
        `Tenant configuration not found for tenant: ${tenant.id}`,
      );
    }

    const configValue = tenantConfig[0].configValue;

    /**Organization name for silo tenants will be its key
     * whereas for pooled tenants it will be the plan tier
     * all the pooled tenants will be under the same organization
     */
    const orgName =
      planTier === 'PREMIUM' ? tenant.key : planTier.toLowerCase();
    const organizationData: PostOrganizationsRequest = {
      name: orgName,
      // eslint-disable-next-line
      display_name: orgName,
      branding: {
        // eslint-disable-next-line
        logo_url: configValue.logo_url,
        colors: {
          primary: configValue.primary_color,
          // eslint-disable-next-line
          page_background: configValue.page_background,
        },
      },
      // eslint-disable-next-line
      enabled_connections: configValue.enabled_connections,
    };
    function generateStrongPassword(length: number): string {
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

    const passwordLength = 20;
    const password = generateStrongPassword(passwordLength);
    const userData: UserCreate = {
      email: tenant.contacts[0].email,

      connection: configValue.connection,
      /* saving a constant password for now
       ** this will a random generated string that will be temporary password
       ** the user will be forced to change it on first login
       ** need to check actions in auth0 to see how we can achieve this
       **/
      password: password,
      // eslint-disable-next-line
      verify_email: configValue.verify_email,
      // eslint-disable-next-line
      phone_number: configValue.phone_number,
      // eslint-disable-next-line
      user_metadata: configValue.user_metadata,
      blocked: configValue.blocked,
      // eslint-disable-next-line
      email_verified: configValue.email_verified,
      // eslint-disable-next-line
      app_metadata: configValue.app_metadata,
      // eslint-disable-next-line
      given_name: configValue.given_name,
      // eslint-disable-next-line
      family_name: configValue.family_name,
      nickname: configValue.nickname,
      picture: configValue.picture,
      // eslint-disable-next-line
      user_id: configValue.user_id,
    };

    let organizationId!: string;

    if (planTier === 'PREMIUM') {
      const organization = await this.createOrganization(organizationData);
      organizationId = organization.data.id;
    } else {
      try {
        const organizationResponse =
          await this.management.organizations.getByName({name: orgName});

        if (organizationResponse.status === STATUS_OK) {
          organizationId = organizationResponse.data.id;
        }
      } catch (error) {
        if (error.statusCode === STATUS_NOT_FOUND) {
          const organization = await this.createOrganization(organizationData);
          organizationId = organization.data.id;
        } else {
          throw new Error(`Error checking organization: ${error.message}`);
        }
      }
    }

    if (!organizationId) {
      throw new Error('Failed to retrieve or create organization ID.');
    }

    const user = await this.createUser(userData);
    const userId = user.data.user_id;

    await this.addMemberToOrganization(organizationId, userId);
    return {
      authId: userId,
    };
  }
  async createOrganization(data: PostOrganizationsRequest) {
    try {
      return await this.management.organizations.create(data);
    } catch (error) {
      throw new Error(`Error creating organization: ${error.message}`);
    }
  }
  async createUser(userData: UserCreate) {
    try {
      return await this.management.users.create(userData);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async addMemberToOrganization(organizationId: string, userId: string) {
    try {
      return await this.management.organizations.addMembers(
        {id: organizationId},
        {
          members: [userId],
        },
      );
    } catch (error) {
      throw new Error(`Error adding member to organization: ${error.message}`);
    }
  }
}
