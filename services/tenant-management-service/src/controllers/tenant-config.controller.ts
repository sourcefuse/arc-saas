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
  response,
} from '@loopback/rest';
import {TenantConfig} from '../models';
import {TenantConfigRepository} from '../repositories';

export class TenantConfigController {
  constructor(
    @repository(TenantConfigRepository)
    public tenantConfigRepository : TenantConfigRepository,
  ) {}

  @post('/tenant-configs')
  @response(200, {
    description: 'TenantConfig model instance',
    content: {'application/json': {schema: getModelSchemaRef(TenantConfig)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {
            title: 'NewTenantConfig',
            exclude: ['id'],
          }),
        },
      },
    })
    tenantConfig: Omit<TenantConfig, 'id'>,
  ): Promise<TenantConfig> {
    return this.tenantConfigRepository.create(tenantConfig);
  }

  @get('/tenant-configs/count')
  @response(200, {
    description: 'TenantConfig model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TenantConfig) where?: Where<TenantConfig>,
  ): Promise<Count> {
    return this.tenantConfigRepository.count(where);
  }

  @get('/tenant-configs')
  @response(200, {
    description: 'Array of TenantConfig model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TenantConfig, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TenantConfig) filter?: Filter<TenantConfig>,
  ): Promise<TenantConfig[]> {
    return this.tenantConfigRepository.find(filter);
  }

  @patch('/tenant-configs')
  @response(200, {
    description: 'TenantConfig PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {partial: true}),
        },
      },
    })
    tenantConfig: TenantConfig,
    @param.where(TenantConfig) where?: Where<TenantConfig>,
  ): Promise<Count> {
    return this.tenantConfigRepository.updateAll(tenantConfig, where);
  }

  @get('/tenant-configs/{id}')
  @response(200, {
    description: 'TenantConfig model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TenantConfig, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TenantConfig, {exclude: 'where'}) filter?: FilterExcludingWhere<TenantConfig>
  ): Promise<TenantConfig> {
    return this.tenantConfigRepository.findById(id, filter);
  }

  @patch('/tenant-configs/{id}')
  @response(204, {
    description: 'TenantConfig PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {partial: true}),
        },
      },
    })
    tenantConfig: TenantConfig,
  ): Promise<void> {
    await this.tenantConfigRepository.updateById(id, tenantConfig);
  }

  @put('/tenant-configs/{id}')
  @response(204, {
    description: 'TenantConfig PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tenantConfig: TenantConfig,
  ): Promise<void> {
    await this.tenantConfigRepository.replaceById(id, tenantConfig);
  }

  @del('/tenant-configs/{id}')
  @response(204, {
    description: 'TenantConfig DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tenantConfigRepository.deleteById(id);
  }
}
