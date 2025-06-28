import {BindingScope, injectable} from '@loopback/core';
import {TenantMgmtModelBooter} from '../model.booter';

@injectable({scope: BindingScope.SINGLETON})
export class WebhookModelBooter extends TenantMgmtModelBooter {
  protected override readonly component =
    'WebhookTenantManagementServiceComponent';
}
