import {Getter, inject} from '@loopback/core';
import {Service, ServiceRelations} from '../../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import { SequelizeCrudRepository,SequelizeDataSource } from '@loopback/sequelize';
export class ServiceRepository<
  T extends Service = Service,
> extends SequelizeCrudRepository<
  T,
  typeof Service.prototype.id,
  ServiceRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Service')
    private readonly service: typeof Entity & {prototype: T},
  ) {
    super(service, dataSource);
  }
}
