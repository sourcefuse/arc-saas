import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {LeadToken} from '../models';
import {TenantManagementCacheSourceName} from '../types';

export class LeadTokenRepository extends DefaultKeyValueRepository<LeadToken> {
  constructor(
    @inject(`datasources.${TenantManagementCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(LeadToken, dataSource);
  }
}
