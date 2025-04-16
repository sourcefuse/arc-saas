import {Getter, inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Invoice} from '../../models';
import {SubscriptionDbSourceName} from '../../types';
import { SequelizeCrudRepository,SequelizeDataSource } from '@loopback/sequelize';
export class InvoiceRepository<
  T extends Invoice = Invoice,
> extends SequelizeCrudRepository<T, typeof Invoice.prototype.id, {}> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Invoice')
    private readonly invoice: typeof Entity & {prototype: T},
  ) {
    super(invoice, dataSource);
  }
}
