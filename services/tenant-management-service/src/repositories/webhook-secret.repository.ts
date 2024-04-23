import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {WebhookSecret} from '../models';
import {TenantManagementCacheSourceName} from '../types';

export class WebhookSecretRepository extends DefaultKeyValueRepository<WebhookSecret> {
  constructor(
    @inject(`datasources.${TenantManagementCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(WebhookSecret, dataSource);
  }
}
