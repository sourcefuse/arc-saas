import {post, requestBody} from '@loopback/rest';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  CONTENT_TYPE,
  rateLimitKeyGenPublic,
  getModelSchemaRefSF,
} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {WebhookDTO} from '../../models';
import {WebhookPayload} from '../../types';
import {inject, intercept} from '@loopback/core';
import {WEBHOOK_VERIFIER} from '../../keys';
import {ratelimit} from 'loopback4-ratelimiter';
import {WebhookHelperService} from '../../services/webhook-helper.service';

const basePath = '/webhook';
export class WebhookController<T extends WebhookPayload['data']> {
  constructor(
    @inject('services.WebhookHelperService')
    private readonly webhookService: WebhookHelperService<T>,
  ) {}
  @intercept(WEBHOOK_VERIFIER)
  @ratelimit(true, {
    max: Number.parseInt(process.env.WEBHOOK_API_MAX_ATTEMPTS ?? '10'),
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
          schema: getModelSchemaRefSF(WebhookDTO, {
            title: 'WebhookDTO',
          }),
        },
      },
    })
    dto: WebhookDTO<T>,
  ): Promise<void> {
    return this.webhookService.process(dto);
  }
}
