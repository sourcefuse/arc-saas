import {intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {WEBHOOK_VERIFIER} from '../keys';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';

export class WebhookController {
  constructor(
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
  ) {}

  @authorize({
    permissions: ['*'],
  })
  @intercept(WEBHOOK_VERIFIER)
  @post('/webhooks/chargebee')
  async handleWebhook(@requestBody() payload: any): Promise<void> {
    const event = payload.event_type;
    const content = payload.content;

    switch (event) {
      case 'payment_succeeded':
        await this.handlePaymentSucceeded(content);
        break;
      // Handle other events here
      default:
        console.log(`Unhandled event type: ${event}`);
    }
  }

  private async handlePaymentSucceeded(content: any): Promise<void> {
    const paymentDetails = content.transaction;
    const customerId = paymentDetails.customer_id;
    const customer = await this.billingCustomerRepository.find({
      where: {customerId: customerId},
    });
    await this.billingCustomerRepository.updateById(customer[0].id, {
      invoiceStatus: content.invoice.status,
    });
  }
}
