import {injectable} from '@loopback/context';
import {TenantManagementServiceBindings} from '../keys';

export function webhookHandler() {
  return injectable(TenantManagementServiceBindings.asWebhookHandler);
}
