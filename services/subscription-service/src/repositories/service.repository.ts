import {Getter, inject} from '@loopback/core';
import {Service, ServiceRelations} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity, juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class ServiceRepository<
  T extends Service = Service,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof Service.prototype.id,
  ServiceRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Service')
    private readonly service: typeof Entity & {prototype: T},
  ) {
    super(service, dataSource, getCurrentUser);
  }
}
