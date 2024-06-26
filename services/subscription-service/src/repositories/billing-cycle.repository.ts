import {Getter, inject} from '@loopback/core';
import {BillingCycle, BillingCycleRelations} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class BillingCycleRepository extends DefaultUserModifyCrudRepository<
  BillingCycle,
  typeof BillingCycle.prototype.id,
  BillingCycleRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(BillingCycle, dataSource, getCurrentUser);
  }
}
