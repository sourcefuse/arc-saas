import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {Subscription, SubscriptionRelations, Plan} from '../models';
import {PlanRepository} from './plan.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {SubscriptionDbSourceName} from '../types';

export class SubscriptionRepository extends DefaultUserModifyCrudRepository<
  Subscription,
  typeof Subscription.prototype.id,
  SubscriptionRelations
> {
  public readonly plan: BelongsToAccessor<
    Plan,
    typeof Subscription.prototype.id
  >;

  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('PlanRepository')
    protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(Subscription, dataSource, getCurrentUser);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
