import {post, requestBody, getModelSchemaRef, HttpErrors} from '@loopback/rest';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  CONTENT_TYPE,
  rateLimitKeyGenPublic,
} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {WebhookDTO} from '../models';
import {IWebhookHandler, WebhookPayload} from '../types';
import {Getter, extensionPoint, extensions, intercept} from '@loopback/core';
import {WEBHOOK_VERIFIER, WebhookHandlerEP} from '../keys';
import {ratelimit} from 'loopback4-ratelimiter';

const basePath = '/webhook';
@extensionPoint(WebhookHandlerEP.key)
export class WebhookController<T extends WebhookPayload['data']> {
  constructor(
    @extensions()
    private readonly getHandlers: Getter<IWebhookHandler[]>,
  ) {}
  @intercept(WEBHOOK_VERIFIER)
  @ratelimit(true, {
    max: parseInt(process.env.WEBHOOK_API_MAX_ATTEMPTS ?? '10'),
    keyGenerator: rateLimitKeyGenPublic,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(`${basePath}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Webhook success',
      },
    },
  })
  async webhook(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(WebhookDTO, {
            title: 'WebhookDTO',
          }),
        },
      },
    })
    dto: WebhookDTO<T>,
  ): Promise<void> {
    const handlers = await this.getHandlers();
    const handler = handlers.find(h => h.type === dto.type);
    if (handler) {
      await handler.handle(dto);
    } else {
      throw new HttpErrors.UnprocessableEntity('Invalid type of webhook');
    }
  }
}
