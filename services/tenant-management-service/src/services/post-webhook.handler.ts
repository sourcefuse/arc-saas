import {
  IPostWebhookHandlerService,
  ResourceProvisionedWebhookPayload,
} from '../types';

export class PostWebhookHandlerService<
  T extends ResourceProvisionedWebhookPayload,
> implements IPostWebhookHandlerService<T> {
  async postWebhookHandler(dto: T): Promise<void> {
    return;
  }
}
