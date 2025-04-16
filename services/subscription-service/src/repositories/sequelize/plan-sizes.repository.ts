import {Getter, inject} from '@loopback/core';
import {PlanSizes, PlanSizesRelations} from '../../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import { SequelizeCrudRepository,SequelizeDataSource } from '@loopback/sequelize';
export class PlanSizesRepository<
  T extends PlanSizes = PlanSizes,
> extends SequelizeCrudRepository<
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
    super(planSizes, dataSource);
  }
}
