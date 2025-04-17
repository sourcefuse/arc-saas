import {Getter, inject} from '@loopback/core';
import {BillingCycle} from '../../models';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
export class BillingCycleRepository<
  T extends BillingCycle = BillingCycle,
> extends SequelizeCrudRepository<T, typeof BillingCycle.prototype.id, {}> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.BillingCycle')
    private readonly billingCycle: typeof Entity & {prototype: T},
  ) {
    super(billingCycle, dataSource);
  }
}
