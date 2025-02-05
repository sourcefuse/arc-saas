import {Getter, inject} from '@loopback/core';
import {BillingCycle} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity, juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class BillingCycleRepository<
  T extends BillingCycle = BillingCycle,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof BillingCycle.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.BillingCycle')
    private readonly billingCycle: typeof Entity & {prototype: T},
  ) {
    super(billingCycle, dataSource, getCurrentUser);
  }
}
