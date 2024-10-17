import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {TenantMgmtConfig, Tenant} from '../models';
import {TenantMgmtConfigRepository} from '../repositories';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';

const basePath = '/tenant-configs/{id}/tenant';
export class TenantMgmtConfigTenantController {
  constructor(
    @repository(TenantMgmtConfigRepository)
    public tenantConfigRepository: TenantMgmtConfigRepository,
  ) {}
  @authorize({
    permissions: [PermissionKey.ViewTenantConfig],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
    @param.path.string('id') id: typeof TenantMgmtConfig.prototype.id,
  ): Promise<Tenant> {
    return this.tenantConfigRepository.tenant(id);
  }
}
