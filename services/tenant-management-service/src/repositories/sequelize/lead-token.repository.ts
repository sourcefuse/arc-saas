import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {LeadToken} from '../../models';
import {TenantManagementCacheSourceName} from '../../types';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
export class LeadTokenRepository<
  T extends LeadToken = LeadToken,
> extends SequelizeCrudRepository<T, typeof LeadToken.prototype.token> {
  constructor(
    @inject(`datasources.${TenantManagementCacheSourceName}`)
    dataSource: SequelizeDataSource,
    @inject('models.LeadToken')
    private readonly leadToken: typeof Entity & {prototype: T},
  ) {
    super(leadToken, dataSource);
  }
}
