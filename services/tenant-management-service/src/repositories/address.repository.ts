import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, Entity, juggler} from '@loopback/repository';
import {
  DefaultTransactionalUserModifyRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

import {Address, Tenant} from '../models';
import {SYSTEM_USER} from '../keys';
import {TenantManagementDbSourceName} from '../types';

export class AddressRepository<
  T extends Address = Address,
> extends DefaultTransactionalUserModifyRepository<
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
    dataSource: juggler.DataSource,
    @inject('models.Address')
    private readonly address: typeof Entity & {prototype: T},
  ) {
    super(address, dataSource, getCurrentUser);
  }
}
