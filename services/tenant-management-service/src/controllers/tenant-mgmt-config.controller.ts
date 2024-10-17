import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {TenantMgmtConfig} from '../models';
import {TenantMgmtConfigRepository} from '../repositories';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
const basePath = '/tenant-configs';
export class TenantMgmtConfigController {
  constructor(
    @repository(TenantMgmtConfigRepository)
    public tenantConfigRepository: TenantMgmtConfigRepository,
  ) {}
  @authorize({
    permissions: [PermissionKey.CreateTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant Config model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(TenantMgmtConfig)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantMgmtConfig, {
            title: 'NewTenantConfig',
            exclude: ['id'],
          }),
        },
      },
    })
    tenantConfig: Omit<TenantMgmtConfig, 'id'>,
  ): Promise<TenantMgmtConfig> {
    return this.tenantConfigRepository.create(tenantConfig);
  }
  @authorize({
    permissions: [PermissionKey.ViewTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant Config model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(TenantMgmtConfig) where?: Where<TenantMgmtConfig>,
  ): Promise<Count> {
    return this.tenantConfigRepository.count(where);
  }
  @authorize({
    permissions: [PermissionKey.ViewTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of TenantConfig model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TenantMgmtConfig, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(TenantMgmtConfig) filter?: Filter<TenantMgmtConfig>,
  ): Promise<TenantMgmtConfig[]> {
    return this.tenantConfigRepository.find(filter);
  }
  @authorize({
    permissions: [PermissionKey.UpdateTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant Config PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(TenantMgmtConfig),
          },
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantMgmtConfig, {partial: true}),
        },
      },
    })
    tenantConfig: TenantMgmtConfig,
    @param.where(TenantMgmtConfig) where?: Where<TenantMgmtConfig>,
  ): Promise<Count> {
    return this.tenantConfigRepository.updateAll(tenantConfig, where);
  }
  @authorize({
    permissions: [PermissionKey.ViewTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant Config model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(TenantMgmtConfig)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TenantMgmtConfig, {exclude: 'where'})
    filter?: FilterExcludingWhere<TenantMgmtConfig>,
  ): Promise<TenantMgmtConfig> {
    return this.tenantConfigRepository.findById(id, filter);
  }
  @authorize({
    permissions: [PermissionKey.UpdateTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant Config PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(TenantMgmtConfig),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantMgmtConfig, {partial: true}),
        },
      },
    })
    tenantConfig: TenantMgmtConfig,
  ): Promise<void> {
    await this.tenantConfigRepository.updateById(id, tenantConfig);
  }
  @authorize({
    permissions: [PermissionKey.UpdateTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant Config PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tenantConfig: TenantMgmtConfig,
  ): Promise<void> {
    await this.tenantConfigRepository.replaceById(id, tenantConfig);
  }
  @authorize({
    permissions: [PermissionKey.DeleteTenantConfig],
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
    await this.tenantConfigRepository.deleteById(id);
  }
}
