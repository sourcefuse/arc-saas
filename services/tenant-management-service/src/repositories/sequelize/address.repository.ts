import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, Entity} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {Address, Tenant} from '../../models';
import {SYSTEM_USER} from '../../keys';
import {TenantManagementDbSourceName} from '../../types';

export class AddressRepository<
  T extends Address = Address,
> extends SequelizeUserModifyCrudRepository<
  T,
  typeof Address.prototype.id,
  {}
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof Address.prototype.id
  >;

  constructor(
    @inject.getter(SYSTEM_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject('models.Address')
    private readonly address: typeof Entity & {prototype: T},
  ) {
    super(address, dataSource, getCurrentUser);
  }
}
