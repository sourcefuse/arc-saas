import {Getter, inject} from '@loopback/core';
import {Plan, PlanRelations, BillingCycle, Currency} from '../../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  repository,
  BelongsToAccessor,
  Entity,
} from '@loopback/repository';
import {BillingCycleRepository} from './billing-cycle.repository';
import {CurrencyRepository} from './currency.repository';
import {SubscriptionDbSourceName} from '../../types';
import { SequelizeCrudRepository,SequelizeDataSource } from '@loopback/sequelize';
export class PlanRepository<
  T extends Plan = Plan,
> extends SequelizeCrudRepository<
  T,
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
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('BillingCycleRepository')
    protected billingCycleRepositoryGetter: Getter<BillingCycleRepository>,
    @repository.getter('CurrencyRepository')
    protected currencyRepositoryGetter: Getter<CurrencyRepository>,
    @inject('models.Plan')
    private readonly plan: typeof Entity & {prototype: T},
  ) {
    super(plan, dataSource);
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
