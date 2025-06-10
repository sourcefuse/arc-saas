import {Getter, inject} from '@loopback/core';
import {PlanSizes, PlanSizesRelations} from '../../models';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
export class PlanSizesRepository<
  T extends PlanSizes = PlanSizes,
> extends SequelizeUserModifyCrudRepository<
  T,
  typeof PlanSizes.prototype.id,
  PlanSizesRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.PlanSizes')
    private readonly planSizes: typeof Entity & {prototype: T},
  ) {
    super(planSizes, dataSource, getCurrentUser);
  }
}
