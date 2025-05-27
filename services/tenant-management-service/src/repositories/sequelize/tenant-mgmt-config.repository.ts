import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor, Entity} from '@loopback/repository';
import {Tenant, TenantMgmtConfig} from '../../models';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {TenantManagementServiceBindings} from '../../keys';
import {TenantManagementDbSourceName} from '../../types';
import {TenantRepository} from './tenant.repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';

export class TenantMgmtConfigRepository<
  T extends TenantMgmtConfig = TenantMgmtConfig,
> extends SequelizeCrudRepository<T, typeof TenantMgmtConfig.prototype.id, {}> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof TenantMgmtConfig.prototype.id
  >;

  constructor(
    @inject.getter(TenantManagementServiceBindings.SYSTEM_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @inject('models.TenantMgmtConfig')
    private readonly tenantMgmtConfig: typeof Entity & {
      prototype: T;
    },
  ) {
    super(tenantMgmtConfig, dataSource);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
