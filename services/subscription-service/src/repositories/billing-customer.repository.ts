import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {BillingCustomer} from '../models/billing-customer.model';
import {SubscriptionDbSourceName} from '../types';

export class BillingCustomerRepository extends DefaultUserModifyCrudRepository<
  BillingCustomer,
  typeof BillingCustomer.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(BillingCustomer, dataSource, getCurrentUser);
  }
}
