import {Getter, inject} from '@loopback/core';
import {
  Entity,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {BillingCustomer, Invoice} from '../../models';
import {SubscriptionDbSourceName} from '../../types';
import {InvoiceRepository} from './../invoice.repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
export class BillingCustomerRepository<
  T extends BillingCustomer = BillingCustomer,
> extends SequelizeCrudRepository<T, typeof BillingCustomer.prototype.id, {}> {
  public readonly invoices: HasManyRepositoryFactory<
    Invoice,
    typeof BillingCustomer.prototype.id
  >;

  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('InvoiceRepository')
    protected invoiceRepositoryGetter: Getter<InvoiceRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.BillingCustomer')
    private readonly billingCustomer: typeof Entity & {
      prototype: T;
    },
  ) {
    super(billingCustomer, dataSource);
    this.invoices = this.createHasManyRepositoryFactoryFor(
      'invoices',
      invoiceRepositoryGetter,
    );
    this.registerInclusionResolver('invoices', this.invoices.inclusionResolver);
  }
}
