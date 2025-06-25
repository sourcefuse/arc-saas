import {
  Getter,
  injectable,
  BindingScope,
  extensions,
  extensionPoint,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IWebhookHandler, WebhookPayload} from '../types';
import {WebhookDTO} from '../models';
import {WebhookHandlerEP} from '../keys';
@injectable({scope: BindingScope.TRANSIENT})
@extensionPoint(WebhookHandlerEP.key)
export class WebhookHelperService<T extends WebhookPayload['data']> {
  constructor(
    @extensions()
    private readonly getHandlers: Getter<IWebhookHandler[]>,
  ) {}

  async process(dto: WebhookDTO<T>): Promise<void> {
    const handlers = await this.getHandlers();
    const handler = handlers.find(h => h.type === dto.type);
    if (handler) {
      await handler.handle(dto);
    } else {
      throw new HttpErrors.UnprocessableEntity('Invalid type of webhook');
    }
  }
}
