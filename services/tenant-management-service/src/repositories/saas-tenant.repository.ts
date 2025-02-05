import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  Entity,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultTransactionalUserModifyRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {
  Address,
  Contact,
  Lead,
  Resource,
  Tenant,
  TenantRelations,
} from '../models';
import {ContactRepository} from './contact.repository';
import {LeadRepository} from './lead.repository';
import {ResourceRepository} from './resource.repository';
import {AddressRepository} from './address.repository';
import {TenantManagementDbSourceName} from '../types';

export class SaasTenantRepository<
  T extends Tenant = Tenant,
> extends DefaultTransactionalUserModifyRepository<
  T,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  public readonly contacts: HasManyRepositoryFactory<
    Contact,
    typeof Tenant.prototype.id
  >;

  public readonly resources: HasManyRepositoryFactory<
    Resource,
    typeof Tenant.prototype.id
  >;

  public readonly lead: BelongsToAccessor<Lead, typeof Tenant.prototype.id>;

  public readonly address: BelongsToAccessor<
    Address,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('ContactRepository')
    protected contactRepositoryGetter: Getter<ContactRepository>,
    @repository.getter('LeadRepository')
    protected leadRepositoryGetter: Getter<LeadRepository>,
    @repository.getter('ResourceRepository')
    protected resourceRepositoryGetter: Getter<ResourceRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>,
    @inject('models.Tenant')
    private readonly tenant: typeof Entity & {prototype: T},
  ) {
    super(tenant, dataSource, getCurrentUser);
    this.lead = this.createBelongsToAccessorFor('lead', leadRepositoryGetter);
    this.registerInclusionResolver('lead', this.lead.inclusionResolver);
    this.contacts = this.createHasManyRepositoryFactoryFor(
      'contacts',
      contactRepositoryGetter,
    );
    this.registerInclusionResolver('contacts', this.contacts.inclusionResolver);

    this.resources = this.createHasManyRepositoryFactoryFor(
      'resources',
      resourceRepositoryGetter,
    );
    this.registerInclusionResolver(
      'resources',
      this.resources.inclusionResolver,
    );

    this.address = this.createBelongsToAccessorFor(
      'address',
      addressRepositoryGetter,
    );
    this.registerInclusionResolver('address', this.address.inclusionResolver);
  }
}
