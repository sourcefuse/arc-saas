import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, Entity, juggler} from '@loopback/repository';
import {LeadToken} from '../models';
import {TenantManagementCacheSourceName} from '../types';

export class LeadTokenRepository<
  T extends LeadToken = LeadToken,
> extends DefaultKeyValueRepository<T> {
  constructor(
    @inject(`datasources.${TenantManagementCacheSourceName}`)
    dataSource: juggler.DataSource,
    @inject('models.LeadToken')
    private readonly leadToken: typeof Entity & {prototype: T},
  ) {
    super(leadToken, dataSource);
  }
}
