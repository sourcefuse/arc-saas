import {Getter, inject} from '@loopback/core';
import {Plan, PlanRelations, BillingCycle, Currency} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {BillingCycleRepository} from './billing-cycle.repository';
import {CurrencyRepository} from './currency.repository';
import {SubscriptionDbSourceName} from '../types';

export class PlanRepository extends DefaultUserModifyCrudRepository<
  Plan,
  typeof Plan.prototype.id,
  PlanRelations
> {
  public readonly billingCycle: BelongsToAccessor<
    BillingCycle,
    typeof Plan.prototype.id
  >;

  public readonly currency: BelongsToAccessor<
    Currency,
    typeof Plan.prototype.id
  >;

  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('BillingCycleRepository')
    protected billingCycleRepositoryGetter: Getter<BillingCycleRepository>,
    @repository.getter('CurrencyRepository')
    protected currencyRepositoryGetter: Getter<CurrencyRepository>,
  ) {
    super(Plan, dataSource, getCurrentUser);
    this.currency = this.createBelongsToAccessorFor(
      'currency',
      currencyRepositoryGetter,
    );
    this.billingCycle = this.createBelongsToAccessorFor(
      'billingCycle',
      billingCycleRepositoryGetter,
    );
    this.registerInclusionResolver(
      'billingCycle',
      this.billingCycle.inclusionResolver,
    );
    this.registerInclusionResolver('currency', this.currency.inclusionResolver);
  }
}
