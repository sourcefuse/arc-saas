import {repository} from '@loopback/repository';
import {param, get} from '@loopback/rest';
import {Subscription, Invoice} from '../models';
import {SubscriptionRepository} from '../repositories';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  getModelSchemaRefSF,
} from '@sourceloop/core';

export class SubscriptionInvoiceController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
  ) {}

  @get('/subscriptions/{id}/invoice', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice belonging to Subscription',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(Invoice),
          },
        },
      },
    },
  })
  async getInvoice(
    @param.path.string('id') id: typeof Subscription.prototype.id,
  ): Promise<Invoice> {
    return this.subscriptionRepository.invoice(id);
  }
}
