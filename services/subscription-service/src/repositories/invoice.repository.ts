import {Getter, inject} from '@loopback/core';
import {Entity, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Invoice} from '../models';
import {SubscriptionDbSourceName} from '../types';

export class InvoiceRepository<
  T extends Invoice = Invoice,
> extends DefaultUserModifyCrudRepository<T, typeof Invoice.prototype.id, {}> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Invoice')
    private readonly invoice: typeof Entity & {prototype: T},
  ) {
    super(invoice, dataSource, getCurrentUser);
  }
}
