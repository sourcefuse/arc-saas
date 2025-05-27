import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, Entity, repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {Contact, Tenant} from '../../models';
import {TenantRepository} from './tenant.repository';
import {TenantManagementDbSourceName} from '../../types';

export class ContactRepository<
  T extends Contact = Contact,
> extends SequelizeCrudRepository<T, typeof Contact.prototype.id, {}> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof Contact.prototype.id
  >;

  constructor(
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @inject('models.Contact')
    private readonly contact: typeof Entity & {prototype: T},
  ) {
    super(contact, dataSource);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
