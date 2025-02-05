import {Getter, inject} from '@loopback/core';
import {
  juggler,
  repository,
  BelongsToAccessor,
  Entity,
} from '@loopback/repository';
import {Tenant, TenantMgmtConfig} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {SYSTEM_USER} from '../keys';
import {TenantManagementDbSourceName} from '../types';
import {TenantRepository} from './tenant.repository';

export class TenantMgmtConfigRepository<
  T extends TenantMgmtConfig = TenantMgmtConfig,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof TenantMgmtConfig.prototype.id,
  {}
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof TenantMgmtConfig.prototype.id
  >;

  constructor(
    @inject.getter(SYSTEM_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @inject('models.TenantMgmtConfig')
    private readonly tenantMgmtConfig: typeof Entity & {
      prototype: T;
    },
  ) {
    super(tenantMgmtConfig, dataSource, getCurrentUser);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
