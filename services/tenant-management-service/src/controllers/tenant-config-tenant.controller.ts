import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TenantConfig,
  Tenant,
} from '../models';
import {TenantConfigRepository} from '../repositories';

export class TenantConfigTenantController {
  constructor(
    @repository(TenantConfigRepository)
    public tenantConfigRepository: TenantConfigRepository,
  ) { }

  @get('/tenant-configs/{id}/tenant', {
    responses: {
      '200': {
        description: 'Tenant belonging to TenantConfig',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tenant),
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.string('id') id: typeof TenantConfig.prototype.id,
  ): Promise<Tenant> {
    return this.tenantConfigRepository.tenant(id);
  }
}
