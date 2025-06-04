import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

import {
  BelongsToAccessor,
  Entity,
  HasOneRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';

import {SYSTEM_USER} from '../keys';
import {Address, Lead, LeadRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';
import {AddressRepository} from './address.repository';
import {TenantManagementDbSourceName} from '../types';

export class LeadRepository<
  T extends Lead = Lead,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof Lead.prototype.id,
  LeadRelations
> {
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
    dataSource: juggler.DataSource,
    @inject.getter(SYSTEM_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>,
    @inject('models.Lead')
    private readonly lead: typeof Entity & {prototype: T},
  ) {
    super(lead, dataSource, getCurrentUser);
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
