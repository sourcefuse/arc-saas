import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RedisDataSource} from '../datasources';
import {LeadToken} from '../models';
import {AuthCacheSourceName} from '@sourceloop/core';

export class LeadTokenRepository extends DefaultKeyValueRepository<LeadToken> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`) dataSource: RedisDataSource,
  ) {
    super(LeadToken, dataSource);
  }
}
