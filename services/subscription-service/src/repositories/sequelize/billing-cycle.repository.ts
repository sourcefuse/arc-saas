import {Getter, inject} from '@loopback/core';
import {BillingCycle} from '../../models';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
export class BillingCycleRepository<
  T extends BillingCycle = BillingCycle,
> extends SequelizeUserModifyCrudRepository<
  T,
  typeof BillingCycle.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.BillingCycle')
    private readonly billingCycle: typeof Entity & {prototype: T},
  ) {
    super(billingCycle, dataSource, getCurrentUser);
  }
}
