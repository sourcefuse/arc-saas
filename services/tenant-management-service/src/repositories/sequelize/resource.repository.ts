import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  Entity,
  repository,
} from '@loopback/repository';
import {
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import { SequelizeCrudRepository,SequelizeDataSource} from '@loopback/sequelize';
import {Resource, ResourceRelations, Tenant} from '../../models';
import {TenantRepository} from './tenant.repository';
import {ResourceData, TenantManagementDbSourceName} from '../../types';

export class ResourceRepository<
  T extends ResourceData['metadata'] = ResourceData['metadata'],
> extends SequelizeCrudRepository<
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
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @inject('models.Resource')
    private readonly resource: typeof Entity & {prototype: Resource<T>},
  ) {
    super(resource, dataSource);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
