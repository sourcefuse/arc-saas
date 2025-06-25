import {Getter, inject} from '@loopback/core';
import {Resource, ResourceRelations} from '../../models';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
export class ResourceRepository<
  T extends Resource = Resource,
> extends SequelizeUserModifyCrudRepository<
  T,
  typeof Resource.prototype.id,
  ResourceRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Resource')
    private readonly resource: typeof Entity & {prototype: T},
  ) {
    super(resource, dataSource, getCurrentUser);
  }
}
