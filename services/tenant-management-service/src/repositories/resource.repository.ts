import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  DefaultTransactionalUserModifyRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {Resource, ResourceRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';
import {ResourceData, TenantManagementDbSourceName} from '../types';

export class ResourceRepository<
  T extends ResourceData['metadata'] = ResourceData['metadata'],
> extends DefaultTransactionalUserModifyRepository<
  Resource<T>,
  typeof Resource.prototype.id,
  ResourceRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof Resource.prototype.id
  >;

  constructor(
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(Resource, dataSource, getCurrentUser);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
