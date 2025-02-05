import {Getter, inject} from '@loopback/core';
import {Currency} from '../models';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {Entity, juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class CurrencyRepository<
  T extends Currency = Currency,
> extends DefaultUserModifyCrudRepository<T, typeof Currency.prototype.id, {}> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Currency')
    private readonly currency: typeof Entity & {prototype: T},
  ) {
    super(currency, dataSource, getCurrentUser);
  }
}
