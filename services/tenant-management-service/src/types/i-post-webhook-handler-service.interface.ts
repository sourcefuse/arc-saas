import {ResourceProvisionedWebhookPayload} from './webhook-payload.type';

export interface IPostWebhookHandlerService<
  T extends ResourceProvisionedWebhookPayload,
> {
  postWebhookHandler(dto: T): Promise<void>;
}
