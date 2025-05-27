import {Getter, inject} from '@loopback/core';
import {Currency} from '../../models';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {Entity} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../../types';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
export class CurrencyRepository<
  T extends Currency = Currency,
> extends SequelizeCrudRepository<T, typeof Currency.prototype.id, {}> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Currency')
    private readonly currency: typeof Entity & {prototype: T},
  ) {
    super(currency, dataSource);
  }
}
