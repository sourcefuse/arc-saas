import {Getter, inject} from '@loopback/core';
import {Resource, ResourceRelations} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class ResourceRepository extends DefaultUserModifyCrudRepository<
  Resource,
  typeof Resource.prototype.id,
  ResourceRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Resource, dataSource, getCurrentUser);
  }
}
