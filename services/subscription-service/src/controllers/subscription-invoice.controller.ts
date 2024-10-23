import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Subscription, Invoice} from '../models';
import {SubscriptionRepository} from '../repositories';

export class SubscriptionInvoiceController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
  ) {}

  @get('/subscriptions/{id}/invoice', {
    responses: {
      '200': {
        description: 'Invoice belonging to Subscription',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Invoice),
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
