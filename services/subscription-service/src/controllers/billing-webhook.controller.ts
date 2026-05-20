import {inject, intercept} from '@loopback/core';
import {post, requestBody, HttpErrors} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  BillingComponentBindings,
  ISubscriptionService,
  TSubscriptionResult,
} from 'loopback4-billing';
import {} from '@loopback/core';
import {repository} from '@loopback/repository';
import {WEBHOOK_VERIFIER} from '../keys';
import {InvoiceRepository} from '../repositories';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';
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
  INVOICE_GENERATED = 'invoice_generated',
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
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
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

    console.log(`[BillingWebhook] Received event: ${eventType}`);

    try {
      switch (eventType) {
        case ChargebeeEvent.SUBSCRIPTION_CREATED:
          await this.onSubscriptionCreated(content);
          break;

        case ChargebeeEvent.SUBSCRIPTION_ACTIVATED:
          await this.onSubscriptionActivated(content);
          break;

        case ChargebeeEvent.SUBSCRIPTION_CHANGED:
          await this.onSubscriptionChanged(content);
          break;

        case ChargebeeEvent.SUBSCRIPTION_CANCELLED:
          await this.onSubscriptionCancelled(content);
          break;

        case ChargebeeEvent.SUBSCRIPTION_PAUSED:
          await this.onSubscriptionPaused(content);
          break;

        case ChargebeeEvent.SUBSCRIPTION_RESUMED:
          await this.onSubscriptionResumed(content);
          break;

        case ChargebeeEvent.SUBSCRIPTION_RENEWED:
          await this.onSubscriptionRenewed(content);
          break;

        case ChargebeeEvent.PAYMENT_SUCCEEDED:
          await this.onPaymentSucceeded(content);
          break;

        case ChargebeeEvent.PAYMENT_FAILED:
          await this.onPaymentFailed(content);
          break;

        case ChargebeeEvent.INVOICE_GENERATED:
          await this.onInvoiceGenerated(content);
          break;

        default:
          console.log(`[BillingWebhook] Unhandled event type: ${eventType}`);
      }
    } catch (err) {
      console.error(`[BillingWebhook] Error handling ${eventType}:`, err);
      // Return 200 to Chargebee regardless — prevents unnecessary retries
      // for business-logic errors; log for manual review.
    }

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

  // ---------------------------------------------------------------------------
  // Subscription lifecycle handlers
  // ---------------------------------------------------------------------------

  /**
   * Fired when a subscription is first created in Chargebee.
   * The subscription may be in `in_trial` or `active` state.
   */
  private async onSubscriptionCreated(content: IWebhookContent): Promise<void> {
    const subscription: TSubscriptionResult = this.mapChargebeeSubscription(
      content.subscription,
    );
    console.log(
      `[BillingWebhook] Subscription created: ${subscription.id} ` +
        `status=${subscription.status} customer=${subscription.customerId}`,
    );
    // TODO: Update your internal subscription record, send welcome email, etc.
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
    const subscriptionId: string = content.subscription?.id ?? '';
    // Verify the subscription state directly from Chargebee via the library
    const subscription: TSubscriptionResult =
      await this.billingService.getSubscription(subscriptionId);
    console.log(
      `[BillingWebhook] Subscription activated (verified): ${subscription.id} ` +
        `status=${subscription.status} customer=${subscription.customerId} ` +
        `periodEnd=${subscription.currentPeriodEnd}`,
    );
    // TODO: Mark subscription as ACTIVE in your DB, provision tenant resources.
  }

  /**
   * Fired when a subscription plan, quantity or add-ons change.
   *
   * Calls billingService.getSubscription() to get the updated plan details
   * directly from Chargebee.
   */
  private async onSubscriptionChanged(content: IWebhookContent): Promise<void> {
    const subscriptionId: string = content.subscription?.id ?? '';
    // Fetch updated subscription from Chargebee via the library
    const subscription: TSubscriptionResult =
      await this.billingService.getSubscription(subscriptionId);
    console.log(
      `[BillingWebhook] Subscription changed (verified): ${subscription.id} ` +
        `newStatus=${subscription.status}`,
    );
    // TODO: Sync the new plan/price to your internal subscription record.
  }

  /**
   * Fired when a subscription is cancelled (immediately or at period end).
   */
  private async onSubscriptionCancelled(
    content: IWebhookContent,
  ): Promise<void> {
    const subscription: TSubscriptionResult = this.mapChargebeeSubscription(
      content.subscription,
    );
    console.log(
      `[BillingWebhook] Subscription cancelled: ${subscription.id} ` +
        `cancelAtPeriodEnd=${subscription.cancelAtPeriodEnd}`,
    );
    // TODO: Update status to CANCELLED, revoke tenant access if needed.
  }

  /**
   * Fired when a subscription enters the paused state.
   */
  private async onSubscriptionPaused(content: IWebhookContent): Promise<void> {
    const subscription: TSubscriptionResult = this.mapChargebeeSubscription(
      content.subscription,
    );
    console.log(`[BillingWebhook] Subscription paused: ${subscription.id}`);
    // TODO: Suspend tenant access, send notification.
  }

  /**
   * Fired when a paused subscription is resumed.
   */
  private async onSubscriptionResumed(content: IWebhookContent): Promise<void> {
    const subscription: TSubscriptionResult = this.mapChargebeeSubscription(
      content.subscription,
    );
    console.log(`[BillingWebhook] Subscription resumed: ${subscription.id}`);
    // TODO: Restore tenant access, send notification.
  }

  /**
   * Fired at the start of each new billing period (renewal).
   */
  private async onSubscriptionRenewed(content: IWebhookContent): Promise<void> {
    const subscription: TSubscriptionResult = this.mapChargebeeSubscription(
      content.subscription,
    );
    console.log(
      `[BillingWebhook] Subscription renewed: ${subscription.id} ` +
        `nextRenewal=${subscription.currentPeriodEnd}`,
    );
    // TODO: Update next billing date in your DB.
  }

  // ---------------------------------------------------------------------------
  // Payment handlers
  // ---------------------------------------------------------------------------

  /**
   * Fired when a payment is successfully collected.
   *
   * Calls billingService.getInvoicePriceDetails() to get the full
   * price breakdown (total, tax, amount excluding tax) from Chargebee.
   */
  private async onPaymentSucceeded(content: IWebhookContent): Promise<void> {
    const invoiceId: string = content.invoice?.id ?? '';
    const transaction = content.transaction;
    // Fetch full price breakdown via the library
    const priceDetails = invoiceId
      ? await this.billingService.getInvoicePriceDetails(invoiceId)
      : null;
    console.log(
      `[BillingWebhook] Payment succeeded — invoice=${invoiceId} ` +
        `amount=${transaction?.amount ?? 'N/A'} ` +
        `total=${priceDetails?.totalAmount ?? 'N/A'} ` +
        `tax=${priceDetails?.taxAmount ?? 'N/A'} ` +
        `currency=${priceDetails?.currency ?? content.invoice?.currency_code ?? 'N/A'}`,
    );
    // TODO: Mark invoice as paid, update subscription record, trigger provisioning.
  }

  /**
   * Fired when a payment attempt fails (card decline, insufficient funds, etc.).
   * Chargebee will retry automatically per your dunning settings.
   */
  private async onPaymentFailed(content: IWebhookContent): Promise<void> {
    const invoice = content.invoice;
    const transaction = content.transaction;
    console.log(
      `[BillingWebhook] Payment FAILED — invoice=${invoice?.id ?? 'N/A'} ` +
        `reason=${transaction?.error_text ?? 'unknown'}`,
    );
    // TODO: Notify tenant, log for dunning review, update subscription status.
    if (!invoice?.id) {
      throw new HttpErrors.UnprocessableEntity(
        '[BillingWebhook] Payment failed event missing invoice ID',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Invoice handlers
  // ---------------------------------------------------------------------------

  /**
   * Fired when Chargebee generates a new invoice.
   * Use this to record the invoice in your system.
   */
  private async onInvoiceGenerated(content: IWebhookContent): Promise<void> {
    const invoice = content.invoice;
    console.log(
      `[BillingWebhook] Invoice generated: ${invoice?.id ?? 'N/A'} ` +
        `total=${invoice?.total ?? 0} ${invoice?.currency_code ?? ''}`,
    );
    // TODO: Create an invoice record in your DB.
  }

  // ---------------------------------------------------------------------------
  // Helper
  // ---------------------------------------------------------------------------

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
