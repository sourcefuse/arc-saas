import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, Entity, juggler} from '@loopback/repository';
import {WebhookSecret} from '../models';
import {TenantManagementCacheSourceName} from '../types';

export class WebhookSecretRepository<
  T extends WebhookSecret = WebhookSecret,
> extends DefaultKeyValueRepository<T> {
  constructor(
    @inject(`datasources.${TenantManagementCacheSourceName}`)
    dataSource: juggler.DataSource,
    @inject('models.WebhookSecret')
    private readonly webhookSecret: typeof Entity & {prototype: T},
  ) {
    super(webhookSecret, dataSource);
  }
}
