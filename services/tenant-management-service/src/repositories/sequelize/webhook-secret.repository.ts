import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {WebhookSecret} from '../../models';
import {TenantManagementCacheSourceName} from '../../types';
import { SequelizeCrudRepository,SequelizeDataSource } from '@loopback/sequelize';
export class WebhookSecretRepository<
  T extends WebhookSecret = WebhookSecret,
> extends SequelizeCrudRepository<T, typeof WebhookSecret.prototype.context> {
  constructor(
    @inject(`datasources.${TenantManagementCacheSourceName}`)
    dataSource: SequelizeDataSource,
    @inject('models.WebhookSecret')
    private readonly webhookSecret: typeof Entity & {prototype: T},
  ) {
    super(webhookSecret, dataSource);
  }
}
