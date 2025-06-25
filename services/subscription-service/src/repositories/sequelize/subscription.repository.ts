import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor, Entity} from '@loopback/repository';
import {Subscription, SubscriptionRelations, Plan, Invoice} from '../../models';
import {PlanRepository} from './plan.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SubscriptionDbSourceName} from '../../types';
import {InvoiceRepository} from './invoice.repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
export class SubscriptionRepository<
  T extends Subscription = Subscription,
> extends SequelizeUserModifyCrudRepository<
  T,
  typeof Subscription.prototype.id,
  SubscriptionRelations
> {
  public readonly plan: BelongsToAccessor<
    Plan,
    typeof Subscription.prototype.id
  >;

  public readonly invoice: BelongsToAccessor<
    Invoice,
    typeof Subscription.prototype.id
  >;

  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('PlanRepository')
    protected planRepositoryGetter: Getter<PlanRepository>,
    @repository.getter('InvoiceRepository')
    protected invoiceRepositoryGetter: Getter<InvoiceRepository>,
    @inject('models.Subscription')
    private readonly subscription: typeof Entity & {prototype: T},
  ) {
    super(subscription, dataSource, getCurrentUser);
    this.invoice = this.createBelongsToAccessorFor(
      'invoice',
      invoiceRepositoryGetter,
    );
    this.registerInclusionResolver('invoice', this.invoice.inclusionResolver);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
