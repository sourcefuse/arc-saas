import {inject} from '@loopback/core';
import {del, get, param, post, put, requestBody} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  BillingComponentBindings,
  CollectionMethod,
  ISubscriptionService,
  ProrationBehavior,
  RecurringInterval,
  TInvoicePrice,
  TPrice,
  TProduct,
  TSubscriptionCreate,
  TSubscriptionResult,
  TSubscriptionUpdate,
} from 'loopback4-billing';

const BASE = '/billing';

/**
 * Sandbox controller that exercises the full subscription lifecycle
 * implemented in loopback4-billing.
 *
 * Every endpoint injects {@link ISubscriptionService} via
 * {@link BillingComponentBindings.SubscriptionProvider} — the new
 * provider-agnostic binding.  Swap the provider in application.ts
 * (ChargeBee ↔ Stripe) without touching this controller.
 */
export class BillingSubscriptionController {
  constructor(
    @inject(BillingComponentBindings.SDKProvider)
    private readonly billingService: ISubscriptionService,
  ) {}

  // -------------------------------------------------------------------------
  // PRODUCT
  // -------------------------------------------------------------------------

  /**
   * Create a new product (Chargebee: Item / Stripe: Product).
   *
   * Example body:
   * ```json
   * {
   *   "name": "Enterprise Plan",
   *   "description": "Full-featured tier",
   *   "metadata": { "item_family_id": "default" }
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/products`, {
    summary: 'Create a billing product (Item / Product)',
    responses: {
      '200': {
        description: 'External product ID',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: {type: 'string', example: 'cbdemo_enterprise'},
              },
              required: ['productId'],
            },
          },
        },
      },
    },
  })
  async createProduct(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              name: {type: 'string'},
              description: {type: 'string'},
              metadata: {type: 'object'},
            },
          },
        },
      },
    })
    product: TProduct,
  ): Promise<{productId: string}> {
    const productId = await this.billingService.createProduct(product);
    return {productId};
  }

  /**
   * Check whether a product/item exists and is still active.
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/products/{productId}/exists`, {
    summary: 'Check if a billing product is active',
    responses: {
      '200': {
        description: 'Existence flag',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                exists: {type: 'boolean', example: true},
              },
              required: ['exists'],
            },
          },
        },
      },
    },
  })
  async checkProductExists(
    @param.path.string('productId') productId: string,
  ): Promise<{exists: boolean}> {
    const exists = await this.billingService.checkProductExists(productId);
    return {exists};
  }

  // -------------------------------------------------------------------------
  // PRICE / PLAN
  // -------------------------------------------------------------------------

  /**
   * Create a recurring price (Chargebee: ItemPrice / Stripe: Price).
   *
   * Example body:
   * ```json
   * {
   *   "currency": "usd",
   *   "unitAmount": 4999,
   *   "product": "<productId>",
   *   "recurring": { "interval": "month", "intervalCount": 1 }
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/prices`, {
    summary: 'Create a recurring price (ItemPrice / Price)',
    responses: {
      '200': {
        description: 'Created price / item-price object',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {type: 'string', example: 'cbdemo_enterprise-USD-monthly'},
                currency: {type: 'string', example: 'usd'},
                unitAmount: {type: 'number', example: 4999},
                product: {type: 'string', example: 'cbdemo_enterprise'},
                active: {type: 'boolean', example: true},
                recurring: {
                  type: 'object',
                  properties: {
                    interval: {type: 'string', example: 'month'},
                    intervalCount: {type: 'number', example: 1},
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async createPrice(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['currency', 'unitAmount', 'product'],
            properties: {
              id: {type: 'string'},
              currency: {type: 'string', example: 'usd'},
              unitAmount: {type: 'number', example: 4999},
              product: {type: 'string'},
              recurring: {
                type: 'object',
                properties: {
                  interval: {
                    type: 'string',
                    enum: Object.values(RecurringInterval),
                    example: RecurringInterval.MONTH,
                  },
                  intervalCount: {type: 'number', example: 1},
                },
              },
              metadata: {type: 'object'},
            },
          },
        },
      },
    })
    price: TPrice,
  ): Promise<TPrice> {
    return this.billingService.createPrice(price);
  }

  // -------------------------------------------------------------------------
  // SUBSCRIPTION
  // -------------------------------------------------------------------------

  /**
   * Create a new recurring subscription.
   *
   * Example body:
   * ```json
   * {
   *   "customerId": "<chargebee-customer-id>",
   *   "priceRefId": "<item-price-id>",
   *   "collectionMethod": "charge_automatically"
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/subscriptions`, {
    summary: 'Create a new subscription',
    responses: {
      '200': {
        description: 'Newly created subscription ID',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                subscriptionId: {type: 'string', example: 'AzZlGKSfBGHDPJkp'},
              },
              required: ['subscriptionId'],
            },
          },
        },
      },
    },
  })
  async createSubscription(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['customerId', 'priceRefId', 'collectionMethod'],
            properties: {
              customerId: {type: 'string'},
              priceRefId: {type: 'string'},
              collectionMethod: {
                type: 'string',
                enum: Object.values(CollectionMethod),
                example: CollectionMethod.CHARGE_AUTOMATICALLY,
              },
              daysUntilDue: {type: 'number', example: 30},
            },
          },
        },
      },
    })
    subscription: TSubscriptionCreate,
  ): Promise<{subscriptionId: string}> {
    const subscriptionId =
      await this.billingService.createSubscription(subscription);
    return {subscriptionId};
  }

  /**
   * Get the current state of an existing subscription.
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/subscriptions/{subscriptionId}`, {
    summary: 'Get a subscription by ID',
    responses: {
      '200': {
        description: 'Subscription object',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {type: 'string', example: 'AzZlGKSfBGHDPJkp'},
                status: {type: 'string', example: 'active'},
                customerId: {type: 'string', example: 'cust_001'},
                currentPeriodStart: {type: 'number', example: 1700000000},
                currentPeriodEnd: {type: 'number', example: 1702678400},
                cancelAtPeriodEnd: {type: 'boolean', example: false},
              },
              required: ['id', 'status', 'customerId'],
            },
          },
        },
      },
    },
  })
  async getSubscription(
    @param.path.string('subscriptionId') subscriptionId: string,
  ): Promise<TSubscriptionResult> {
    return this.billingService.getSubscription(subscriptionId);
  }

  /**
   * Upgrade or downgrade an existing subscription.
   *
   * Example body:
   * ```json
   * {
   *   "priceRefId": "<new-item-price-id>",
   *   "prorationBehavior": "create_prorations"
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @put(`${BASE}/subscriptions/{subscriptionId}`, {
    summary: 'Upgrade / downgrade a subscription (plan change)',
    responses: {
      '200': {
        description: 'Updated subscription object',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {type: 'string', example: 'AzZlGKSfBGHDPJkp'},
                status: {type: 'string', example: 'active'},
                customerId: {type: 'string', example: 'cust_001'},
                currentPeriodStart: {type: 'number', example: 1700000000},
                currentPeriodEnd: {type: 'number', example: 1702678400},
                cancelAtPeriodEnd: {type: 'boolean', example: false},
              },
              required: ['id', 'status', 'customerId'],
            },
          },
        },
      },
    },
  })
  async updateSubscription(
    @param.path.string('subscriptionId') subscriptionId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              priceRefId: {type: 'string'},
              prorationBehavior: {
                type: 'string',
                enum: Object.values(ProrationBehavior),
                example: ProrationBehavior.CREATE_PRORATIONS,
              },
            },
          },
        },
      },
    })
    updates: TSubscriptionUpdate,
  ): Promise<TSubscriptionResult> {
    return this.billingService.updateSubscription(subscriptionId, updates);
  }

  /**
   * Cancel a subscription immediately with proration.
   */
  @authorize({permissions: ['*']})
  @del(`${BASE}/subscriptions/{subscriptionId}`, {
    summary: 'Cancel a subscription immediately',
    responses: {
      '204': {description: 'Subscription cancelled'},
    },
  })
  async cancelSubscription(
    @param.path.string('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    await this.billingService.cancelSubscription(subscriptionId);
  }

  /**
   * Pause an active subscription.
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/subscriptions/{subscriptionId}/pause`, {
    summary: 'Pause a subscription',
    responses: {
      '200': {
        description: 'Subscription paused',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean', example: true},
              },
              required: ['success'],
            },
          },
        },
      },
    },
  })
  async pauseSubscription(
    @param.path.string('subscriptionId') subscriptionId: string,
  ): Promise<{success: boolean}> {
    await this.billingService.pauseSubscription(subscriptionId);
    return {success: true};
  }

  /**
   * Resume a paused subscription.
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/subscriptions/{subscriptionId}/resume`, {
    summary: 'Resume a paused subscription',
    responses: {
      '200': {
        description: 'Subscription resumed',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean', example: true},
              },
              required: ['success'],
            },
          },
        },
      },
    },
  })
  async resumeSubscription(
    @param.path.string('subscriptionId') subscriptionId: string,
  ): Promise<{success: boolean}> {
    await this.billingService.resumeSubscription(subscriptionId);
    return {success: true};
  }

  // -------------------------------------------------------------------------
  // INVOICE
  // -------------------------------------------------------------------------

  /**
   * Get detailed price breakdown (total, tax, amount excluding tax) for an invoice.
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/invoices/{invoiceId}/price-details`, {
    summary: 'Get invoice price details (total, tax, subtotal)',
    responses: {
      '200': {
        description: 'Invoice price breakdown',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                currency: {type: 'string', example: 'usd'},
                totalAmount: {type: 'number', example: 5499},
                taxAmount: {type: 'number', example: 500},
                amountExcludingTax: {type: 'number', example: 4999},
              },
              required: [
                'currency',
                'totalAmount',
                'taxAmount',
                'amountExcludingTax',
              ],
            },
          },
        },
      },
    },
  })
  async getInvoicePriceDetails(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<TInvoicePrice> {
    return this.billingService.getInvoicePriceDetails(invoiceId);
  }

  /**
   * Send the payment link for a given invoice to the customer.
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/invoices/{invoiceId}/send-payment-link`, {
    summary: 'Send hosted payment link for an invoice',
    responses: {
      '200': {
        description: 'Payment link sent',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {type: 'boolean', example: true},
              },
              required: ['success'],
            },
          },
        },
      },
    },
  })
  async sendPaymentLink(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<{success: boolean}> {
    await this.billingService.sendPaymentLink(invoiceId);
    return {success: true};
  }
}
