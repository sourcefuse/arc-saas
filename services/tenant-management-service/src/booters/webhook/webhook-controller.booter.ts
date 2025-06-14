import {BindingScope, injectable} from '@loopback/core';
import {TenantMgmtControllerBooter} from '../controller.booter';

@injectable({scope: BindingScope.SINGLETON})
export class WebhookControllerBooter extends TenantMgmtControllerBooter {
  protected override readonly controllerModules = [
    '../controllers/webhook.controller',
    '../controllers/idp.controller',
    '../controllers/tenant-mgmt-config.controller',
    '../controllers/tenant-mgmt-config-tenant.controller',
  ];
}
