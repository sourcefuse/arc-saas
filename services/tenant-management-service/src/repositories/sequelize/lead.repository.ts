import {Getter, inject} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';

import {
  BelongsToAccessor,
  Entity,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {SYSTEM_USER} from '../../keys';
import {Address, Lead, LeadRelations, Tenant} from '../../models';
import {TenantRepository} from './tenant.repository';
import {AddressRepository} from './address.repository';
import {TenantManagementDbSourceName} from '../../types';

export class LeadRepository<
  T extends Lead = Lead,
> extends SequelizeCrudRepository<T, typeof Lead.prototype.id, LeadRelations> {
  public readonly tenant: HasOneRepositoryFactory<
    Tenant,
    typeof Tenant.prototype.id
  >;

  public readonly address: BelongsToAccessor<
    Address,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(SYSTEM_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>,
    @inject('models.Lead')
    private readonly lead: typeof Entity & {prototype: T},
  ) {
    super(lead, dataSource);
    this.tenant = this.createHasOneRepositoryFactoryFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);

    this.address = this.createBelongsToAccessorFor(
      'address',
      addressRepositoryGetter,
    );
    this.registerInclusionResolver('address', this.address.inclusionResolver);
  }
}
