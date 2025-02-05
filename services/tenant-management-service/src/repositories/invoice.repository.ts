import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  Entity,
  juggler,
  repository,
} from '@loopback/repository';
import {
  DefaultTransactionalUserModifyRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {Invoice, InvoiceRelations, Tenant} from '../models';
import {TenantRepository} from './tenant.repository';
import {TenantManagementDbSourceName} from '../types';

export class InvoiceRepository<
  T extends Invoice = Invoice,
> extends DefaultTransactionalUserModifyRepository<
  T,
  typeof Invoice.prototype.id,
  InvoiceRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof Invoice.prototype.id
  >;

  constructor(
    @inject(`datasources.${TenantManagementDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
    @inject('models.Invoice')
    private readonly invoice: typeof Entity & {prototype: T},
  ) {
    super(invoice, dataSource, getCurrentUser);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
