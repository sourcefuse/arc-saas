import {Provider} from '@loopback/context';

import {ConfigureIdpFunc, IdpDetails, IdPKey} from '../../types';
import {ManagementClient, PostOrganizationsRequest, UserCreate} from 'auth0';

import {Auth0Response} from './types';

import {TenantConfigRepository} from '../../repositories/tenant-config.repository';
import {repository} from '@loopback/repository';

import {HttpErrors} from '@loopback/rest';

const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
export class Auth0IdpProvider
  implements Provider<ConfigureIdpFunc<Auth0Response>>
{
  management: ManagementClient;

  constructor(
    @repository(TenantConfigRepository)
    private readonly tenantConfigRepository: TenantConfigRepository,
  ) {}

  value(): ConfigureIdpFunc<Auth0Response> {
    return payload => this.configure(payload);
  }
  async configure(payload: IdpDetails): Promise<Auth0Response> {
    this.management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN ?? '',
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      audience: process.env.AUTH0_AUDIENCE,
    });
    const {tenant} = payload;
    const planTier = payload.plan.tier;
    const tenantConfig = await this.tenantConfigRepository.findOne({
      where: {tenantId: tenant.id, configKey: IdPKey.AUTH0},
    });
    if (!tenantConfig) {
      throw new HttpErrors.NotFound(
        `Tenant configuration not found for tenant: ${tenant.id}`,
      );
    }
    const configValue = tenantConfig.configValue;
    const organizationData: PostOrganizationsRequest = {
      name: tenant.name,
      // eslint-disable-next-line
      display_name: configValue.display_name,
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

    const userData: UserCreate = {
      email: tenant.contacts[0].email,

      connection: configValue.connection,
      password: configValue.password,
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
          await this.management.organizations.getByName({name: tenant.name});

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
      organizationId: organizationId,
      userId: userId,
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
