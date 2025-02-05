import {Getter, inject} from '@loopback/core';
import {
  Entity,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {BillingCustomer, Invoice} from '../models';
import {SubscriptionDbSourceName} from '../types';
import {InvoiceRepository} from './invoice.repository';

export class BillingCustomerRepository<
  T extends BillingCustomer = BillingCustomer,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof BillingCustomer.prototype.id,
  {}
> {
  public readonly invoices: HasManyRepositoryFactory<
    Invoice,
    typeof BillingCustomer.prototype.id
  >;

  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('InvoiceRepository')
    protected invoiceRepositoryGetter: Getter<InvoiceRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.BillingCustomer')
    private readonly billingCustomer: typeof Entity & {
      prototype: T;
    },
  ) {
    super(billingCustomer, dataSource, getCurrentUser);
    this.invoices = this.createHasManyRepositoryFactoryFor(
      'invoices',
      invoiceRepositoryGetter,
    );
    this.registerInclusionResolver('invoices', this.invoices.inclusionResolver);
  }
}
