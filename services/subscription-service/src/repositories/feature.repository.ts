import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {juggler} from '@loopback/repository';
import {SubscriptionDbSourceName} from '../types';
import {Feature, FeatureRelations} from '../models/feature.model';

export class FeatureRepository extends DefaultUserModifyCrudRepository<
  Feature,
  typeof Feature.prototype.id,
  FeatureRelations
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Feature, dataSource, getCurrentUser);
  }
}
