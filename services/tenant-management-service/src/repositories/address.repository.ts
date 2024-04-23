import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler} from '@loopback/repository';
import {
  DefaultTransactionalUserModifyRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';

import {Address, Tenant} from '../models';
import {SYSTEM_USER} from '../keys';
import {TenantManagementDbSourceName} from '../types';

export class AddressRepository extends DefaultTransactionalUserModifyRepository<
  Address,
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
  ) {
    super(Address, dataSource, getCurrentUser);
  }
}
