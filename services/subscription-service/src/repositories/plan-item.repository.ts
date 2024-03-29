import {Getter, inject} from '@loopback/core';
import {PlanItem, PlanItemRelations, Plan} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {PlanRepository} from './plan.repository';
import { SubscriptionDbSourceName } from '../types';

export class PlanItemRepository extends DefaultUserModifyCrudRepository<
  PlanItem,
  typeof PlanItem.prototype.id,
  PlanItemRelations
> {
  public readonly plan: BelongsToAccessor<Plan, typeof PlanItem.prototype.id>;

  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`) dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('PlanRepository')
    protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(PlanItem, dataSource, getCurrentUser);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
