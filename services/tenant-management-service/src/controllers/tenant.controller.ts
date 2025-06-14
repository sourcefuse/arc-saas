import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {del, get, param, patch, post, put, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  getModelSchemaRefSF,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TenantRepository} from '../repositories/tenant.repository';
import {SubscriptionDTO, Tenant, TenantOnboardDTO} from '../models';
import {PermissionKey} from '../permissions';
import {service} from '@loopback/core';
import {OnboardingService, ProvisioningService} from '../services';
import {IProvisioningService} from '../types';

const basePath = '/tenants';

export default class TenantController {
  constructor(
    @repository(TenantRepository)
    private readonly tenantRepository: TenantRepository,
    @service(OnboardingService)
    private readonly onboarding: OnboardingService,
    @service(ProvisioningService)
    private readonly provisioningService: IProvisioningService<SubscriptionDTO>,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Tenant)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(TenantOnboardDTO, {
            title: 'NewTenantOnboarding',
            exclude: [],
          }),
        },
      },
    })
    dto: TenantOnboardDTO,
  ): Promise<Tenant> {
    return this.onboarding.onboard(dto);
  }

  @authorize({
    permissions: [PermissionKey.ProvisionTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(`${basePath}/{id}/provision`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Provisioning success',
      },
    },
  })
  async provision(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(SubscriptionDTO, {
            title: 'SubscriptionDTO',
          }),
        },
      },
    })
    subscription: SubscriptionDTO,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const tenantDetails = await this.tenantRepository.findById(id, {
      include: ['contacts', 'address'],
    });

    return this.provisioningService.provisionTenant(
      tenantDetails,
      subscription,
    );
  }

  @authorize({
    permissions: [PermissionKey.ViewTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Tenant) where?: Where<Tenant>): Promise<Count> {
    return this.tenantRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Tenant model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(Tenant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Tenant) filter?: Filter<Tenant>): Promise<Tenant[]> {
    return this.tenantRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Tenant),
          },
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Tenant, {partial: true}),
        },
      },
    })
    tenant: Tenant,
    @param.where(Tenant) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.tenantRepository.updateAll(tenant, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Tenant)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Tenant, {exclude: 'where'})
    filter?: Filter<Tenant>,
  ): Promise<Tenant> {
    return this.tenantRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Tenant),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Tenant, {partial: true}),
        },
      },
    })
    tenant: Tenant,
  ): Promise<void> {
    await this.tenantRepository.updateById(id, tenant);
  }

  @authorize({
    permissions: [PermissionKey.UpdateTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tenant: Tenant,
  ): Promise<void> {
    await this.tenantRepository.replaceById(id, tenant);
  }

  @authorize({
    permissions: [PermissionKey.DeleteTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tenantRepository.deleteById(id);
  }
}
