import {Getter, inject} from '@loopback/core';
import {PlanSizes, PlanSizesRelations} from '../models';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Entity, juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';

export class PlanSizesRepository<
  T extends PlanSizes = PlanSizes,
> extends DefaultUserModifyCrudRepository<
  T,
  typeof PlanSizes.prototype.id,
  PlanSizesRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject('models.PlanSizes')
    private readonly planSizes: typeof Entity & {prototype: T},
  ) {
    super(planSizes, dataSource, getCurrentUser);
  }
}
