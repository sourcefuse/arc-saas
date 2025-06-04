import {injectable} from '@loopback/context';
import {asWebhookHandler} from '../keys';

export function webhookHandler() {
  return injectable(asWebhookHandler);
}
