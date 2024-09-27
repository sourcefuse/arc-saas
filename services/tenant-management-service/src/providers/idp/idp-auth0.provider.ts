import {Provider} from '@loopback/context';

import {ConfigureIdpFunc, IdpDetails} from '../../types';
import {ManagementClient} from 'auth0';

import {Auth0Response, ConfigValue, OrganizationData, UserData} from './types';

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
    const planTier = tenant.plan.tier;
    const tenantConfig = await this.tenantConfigRepository.findOne({
      where: {tenantId: tenant.id},
    });
    if (!tenantConfig) {
      throw new HttpErrors.NotFound(
        `Tenant configuration not found for tenant: ${tenant.id}`,
      );
    }
    const configValue: ConfigValue = tenantConfig.configValue;
    const organizationData: OrganizationData = {
      name: tenant.name,
      // eslint-disable-next-line
      display_name: configValue.display_name,
      // eslint-disable-next-line
      logo_url: configValue.logo_url,
      // eslint-disable-next-line
      primary_color: configValue.primary_color,
      // eslint-disable-next-line
      page_background: configValue.page_background,
      // eslint-disable-next-line
      link_color: configValue.link_color,
    };

    const userData: UserData = {
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
  async createOrganization(data: OrganizationData) {
    try {
      return await this.management.organizations.create({
        name: data.name,
        // eslint-disable-next-line
        display_name: data.display_name,
        branding: {
          // eslint-disable-next-line
          logo_url: data.logo_url,
          colors: {
            primary: data.primary_color ?? '#007BFF',
            // eslint-disable-next-line
            page_background: data.page_background ?? '#007BFF',
          },
        },
        // eslint-disable-next-line
        enabled_connections: [],
      });
    } catch (error) {
      throw new Error(`Error creating organization: ${error.message}`);
    }
  }
  async createUser(userData: UserData) {
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
  initManagementClient(): ManagementClient {
    return new ManagementClient({
      domain: process.env.AUTH0_DOMAIN ?? '',
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      audience: process.env.AUTH0_AUDIENCE,
    });
  }
}
