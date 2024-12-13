import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Invoice} from '../models';
import {SubscriptionDbSourceName} from '../types';

export class InvoiceRepository extends DefaultUserModifyCrudRepository<
  Invoice,
  typeof Invoice.prototype.id,
  {}
> {
  constructor(
    @inject(`datasources.${SubscriptionDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Invoice, dataSource, getCurrentUser);
  }
}
