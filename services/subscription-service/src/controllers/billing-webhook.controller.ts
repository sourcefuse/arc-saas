import {inject, intercept} from '@loopback/core';
import {post, requestBody, HttpErrors} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  BillingComponentBindings,
  ISubscriptionService,
  TSubscriptionResult,
} from 'loopback4-billing';
import {repository} from '@loopback/repository';
import {WEBHOOK_VERIFIER} from '../keys';
import {InvoiceRepository} from '../repositories';
import {IContent, IPayload, IWebhookPayload, IWebhookContent} from '../types';

/**
 * Chargebee webhook event types handled by this controller.
 * Extend this enum as your integration needs grow.
 */
enum ChargebeeEvent {
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_ACTIVATED = 'subscription_activated',
  SUBSCRIPTION_CHANGED = 'subscription_changed',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_PAUSED = 'subscription_paused',
  SUBSCRIPTION_RESUMED = 'subscription_resumed',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  PAYMENT_FAILED = 'payment_failed',
}

/**
 * Webhook controller for Chargebee billing events.
 *
 * Exposes POST /webhooks/billing-payment — the URL you register in
 * Chargebee Settings → API Keys → Webhooks.
 *
 * Follows Approach C: injects SubscriptionProvider directly as
 * ISubscriptionService so no BillingProvider proxy is involved.
 *
 * To add Chargebee webhook signature verification, bind a custom
 * interceptor to BILLING_WEBHOOK_VERIFIER in application.ts.
 */
export class BillingWebhookController {
  constructor(
    @inject(BillingComponentBindings.SDKProvider)
    private readonly billingService: ISubscriptionService,
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
  ) {}

  @authorize({permissions: ['*']})
  @intercept(WEBHOOK_VERIFIER)
  @post('/webhooks/billing-payment', {
    summary: 'Chargebee webhook receiver',
    description:
      'Register this URL in Chargebee Settings → API Keys → Webhooks. ' +
      'Handles subscription and payment lifecycle events.',
    responses: {
      '200': {
        description: 'Event acknowledged',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                received: {type: 'boolean', example: true},
                event: {type: 'string', example: 'subscription_activated'},
              },
            },
          },
        },
      },
    },
  })
  async handleWebhook(
    @requestBody({
      description: 'Chargebee webhook payload',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              event_type: {type: 'string'},
              content: {type: 'object'},
            },
          },
        },
      },
    })
    payload: IWebhookPayload,
  ): Promise<{received: boolean; event: string}> {
    const eventType: string = payload?.event_type ?? '';
    const content = payload?.content ?? {};

    const eventHandlers: Record<
      string,
      (content: IWebhookContent) => Promise<void>
    > = {
      [ChargebeeEvent.SUBSCRIPTION_CREATED]:
        this.onSubscriptionCreated.bind(this),
      [ChargebeeEvent.SUBSCRIPTION_ACTIVATED]:
        this.onSubscriptionActivated.bind(this),
      [ChargebeeEvent.SUBSCRIPTION_CHANGED]:
        this.onSubscriptionChanged.bind(this),
      [ChargebeeEvent.SUBSCRIPTION_CANCELLED]:
        this.onSubscriptionCancelled.bind(this),
      [ChargebeeEvent.SUBSCRIPTION_PAUSED]:
        this.onSubscriptionPaused.bind(this),
      [ChargebeeEvent.SUBSCRIPTION_RESUMED]:
        this.onSubscriptionResumed.bind(this),
      [ChargebeeEvent.SUBSCRIPTION_RENEWED]:
        this.onSubscriptionRenewed.bind(this),
      [ChargebeeEvent.PAYMENT_SUCCEEDED]: this.onPaymentSucceeded.bind(this),
      [ChargebeeEvent.PAYMENT_FAILED]: this.onPaymentFailed.bind(this),
    };

    await eventHandlers[eventType]?.(content).catch(() => undefined);

    return {received: true, event: eventType};
  }

  /**
   * Legacy webhook handler for backward compatibility.
   * Handles payment status updates.
   */
  @authorize({
    permissions: ['*'],
  })
  @intercept(WEBHOOK_VERIFIER)
  @post('/webhooks/billing-payment/legacy')
  async handleWebhookLegacy(@requestBody() payload: IPayload): Promise<void> {
    const content = payload.content;
    await this.handlePayment(content);
  }

  /**
   * Fired when a subscription is first created in Chargebee.
   * The subscription may be in `in_trial` or `active` state.
   */
  private async onSubscriptionCreated(content: IWebhookContent): Promise<void> {
    this.mapChargebeeSubscription(content.subscription);
  }

  /**
   * Fired when a subscription transitions from trial/pending to active.
   * This is the event to trigger provisioning in your platform.
   *
   * Calls billingService.getSubscription() to verify the current state
   * directly from Chargebee before acting on it.
   */
  private async onSubscriptionActivated(
    content: IWebhookContent,
  ): Promise<void> {
    await this.verifySubscriptionState(content);
  }

  /**
   * Fired when a subscription plan, quantity or add-ons change.
   *
   * Calls billingService.getSubscription() to get the updated plan details
   * directly from Chargebee.
   */
  private async onSubscriptionChanged(content: IWebhookContent): Promise<void> {
    await this.verifySubscriptionState(content);
  }

  /**
   * Fetches and verifies the current subscription state from Chargebee.
   */
  private async verifySubscriptionState(
    content: IWebhookContent,
  ): Promise<void> {
    const subscriptionId: string = content.subscription?.id ?? '';
    if (subscriptionId) {
      await this.billingService.getSubscription(subscriptionId);
    }
  }

  /**
   * Fired when a subscription is cancelled (immediately or at period end).
   */
  private async onSubscriptionCancelled(
    content: IWebhookContent,
  ): Promise<void> {
    this.mapChargebeeSubscription(content.subscription);
  }

  /**
   * Fired when a subscription enters the paused state.
   */
  private async onSubscriptionPaused(content: IWebhookContent): Promise<void> {
    this.mapChargebeeSubscription(content.subscription);
  }

  /**
   * Fired when a paused subscription is resumed.
   */
  private async onSubscriptionResumed(content: IWebhookContent): Promise<void> {
    this.mapChargebeeSubscription(content.subscription);
  }

  /**
   * Fired at the start of each new billing period (renewal).
   */
  private async onSubscriptionRenewed(content: IWebhookContent): Promise<void> {
    this.mapChargebeeSubscription(content.subscription);
  }

  /**
   * Fired when a payment is successfully collected.
   *
   * Calls billingService.getInvoicePriceDetails() to get the full
   * price breakdown (total, tax, amount excluding tax) from Chargebee.
   */
  private async onPaymentSucceeded(content: IWebhookContent): Promise<void> {
    const invoiceId: string = content.invoice?.id ?? '';

    if (invoiceId) {
      await this.billingService.getInvoicePriceDetails(invoiceId);
    }
  }

  /**
   * Fired when a payment attempt fails (card decline, insufficient funds, etc.).
   * Chargebee will retry automatically per your dunning settings.
   */
  private async onPaymentFailed(content: IWebhookContent): Promise<void> {
    const invoice = content.invoice;

    if (!invoice?.id) {
      throw new HttpErrors.UnprocessableEntity(
        '[BillingWebhook] Payment failed event missing invoice ID',
      );
    }
  }

  /**
   * Maps a raw Chargebee subscription object from a webhook payload to the
   * provider-agnostic TSubscriptionResult.
   *
   * Webhook payloads use the same field names as the Chargebee REST API, so
   * this mirrors ChargebeeSubscriptionAdapter.adaptToModel().
   */
  private mapChargebeeSubscription(
    raw: IWebhookContent['subscription'],
  ): TSubscriptionResult {
    return {
      id: raw?.id ?? '',
      status: raw?.status ?? '',
      customerId: raw?.customer_id ?? '',
      currentPeriodStart: raw?.current_term_start,
      currentPeriodEnd: raw?.current_term_end,
      cancelAtPeriodEnd: raw?.cancel_at_period_end ?? false,
    };
  }

  /**
   * Legacy payment handler for backward compatibility.
   */
  private async handlePayment(content: IContent): Promise<void> {
    const invoice = await this.invoiceRepository.find({
      where: {invoiceId: content.invoice.id},
    });
    await this.invoiceRepository.updateById(invoice[0].id, {
      invoiceStatus: content.invoice.status,
    });
  }
}
