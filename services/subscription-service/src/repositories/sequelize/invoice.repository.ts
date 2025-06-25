import {Getter, inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Invoice} from '../../models';
import {SubscriptionDbSourceName} from '../../types';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
export class InvoiceRepository<
  T extends Invoice = Invoice,
> extends SequelizeUserModifyCrudRepository<
  T,
  typeof Invoice.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.Invoice')
    private readonly invoice: typeof Entity & {prototype: T},
  ) {
    super(invoice, dataSource, getCurrentUser);
  }
}
