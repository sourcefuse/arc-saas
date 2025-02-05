import {Getter, inject} from '@loopback/core';
import {Resource, ResourceRelations} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity, juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class ResourceRepository<
  T extends Resource = Resource,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof Resource.prototype.id,
  ResourceRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Resource')
    private readonly resource: typeof Entity & {prototype: T},
  ) {
    super(resource, dataSource, getCurrentUser);
  }
}
