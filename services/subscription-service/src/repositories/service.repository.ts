import {Getter, inject} from '@loopback/core';
import {Service, ServiceRelations} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class ServiceRepository extends DefaultUserModifyCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Service, dataSource, getCurrentUser);
  }
}
