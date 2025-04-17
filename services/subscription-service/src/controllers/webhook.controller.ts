import {intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {SubscriptionServiceBindings} from '../keys';
import {InvoiceRepository} from '../repositories';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';
import {IContent, IPayload} from '../types';

export class WebhookController {
  constructor(
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
  ) {}

  @authorize({
    permissions: ['*'],
  })
  @intercept(SubscriptionServiceBindings.WEBHOOK_VERIFIER)
  @post('/webhooks/billing-payment')
  async handleWebhook(@requestBody() payload: IPayload): Promise<void> {
    const content = payload.content;
    await this.handlePayment(content);
  }

  private async handlePayment(content: IContent): Promise<void> {
    const invoice = await this.invoiceRepository.find({
      where: {invoiceId: content.invoice.id},
    });
    await this.invoiceRepository.updateById(invoice[0].id, {
      invoiceStatus: content.invoice.status,
    });
  }
}
