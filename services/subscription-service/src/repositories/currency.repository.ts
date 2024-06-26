import {Getter, inject} from '@loopback/core';
import {Currency, CurrencyRelations} from '../models';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class CurrencyRepository extends DefaultUserModifyCrudRepository<
  Currency,
  typeof Currency.prototype.id,
  CurrencyRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Currency, dataSource, getCurrentUser);
  }
}
