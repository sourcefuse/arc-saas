import {Getter, inject} from '@loopback/core';
import {juggler, repository, BelongsToAccessor} from '@loopback/repository';
import {TenantConfig, Tenant} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {SYSTEM_USER} from '../keys';
import {TenantManagementDbSourceName} from '../types';
import {TenantRepository} from './tenant.repository';

export class TenantConfigRepository extends DefaultUserModifyCrudRepository<
  TenantConfig,
  typeof TenantConfig.prototype.id,
  {}
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof TenantConfig.prototype.id
  >;

  constructor(
    @inject.getter(SYSTEM_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(TenantConfig, dataSource, getCurrentUser);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
