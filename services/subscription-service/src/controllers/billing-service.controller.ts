import {inject} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  BillingComponentBindings,
  IService,
  TInvoicePdf,
  TInvoicePaymentDetails,
  TPaymentIntent,
} from 'loopback4-billing';
import {getModelSchemaRefSF, STATUS_CODE} from '@sourceloop/core';
import {BillingPaymentStatusResponse} from '../models';

const BASE = '/billing';

/**
 * Billing service controller for invoice and payment intent queries.
 *
 * This controller provides additional billing endpoints that are not
 * covered by BillingInvoiceController and BillingPaymentSourceController.
 *
 * For customer CRUD, use BillingCustomerController.
 * For payment source operations, use BillingPaymentSourceController.
 * For invoice CRUD, use BillingInvoiceController.
 *
 * Bound to BillingComponentBindings.SDKProvider (StripeService/ChargeBeeService).
 */
export class BillingServiceController {
  constructor(
    @inject(BillingComponentBindings.SDKProvider)
    private readonly billingService: IService,
  ) {}

  /**
   * Check whether an invoice has been paid.
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/invoices/{invoiceId}/payment-status`, {
    summary: 'Check if an invoice is paid',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment status',
        content: {
          'application/json': {
            schema: {...getModelSchemaRefSF(BillingPaymentStatusResponse)},
          },
        },
      },
    },
  })
  async getPaymentStatus(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<BillingPaymentStatusResponse> {
    const paid = await this.billingService.getPaymentStatus(invoiceId);
    return {paid};
  }

  /**
   * Get PDF download URL for an invoice.
   *
   * Returns a temporary URL to download the invoice PDF.
   * The URL is typically valid for a limited time and should be used immediately.
   *
   * @param invoiceId - The invoice ID (Stripe: in_XXXXX, ChargeBee: inv_XXXXX)
   * @returns PDF information including download URL and metadata
   *
   * Example:
   * GET /billing/invoices/in_1234567890/pdf
   *
   * Response:
   * ```json
   * {
   *   "invoiceId": "in_1234567890",
   *   "pdfUrl": "https://pay.stripe.com/invoice/acct_1ABC/in_1234567890/pdf",
   *   "generatedAt": "2026-05-04T12:00:00.000Z",
   *   "expiresAt": null
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/invoices/{invoiceId}/pdf`, {
    summary: 'Get PDF download URL for an invoice',
    description:
      'Retrieves a temporary URL to download the invoice PDF. ' +
      'For Stripe, only finalized invoices have PDF URLs available. ' +
      'For ChargeBee, most invoice states support PDF generation.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PDF information retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['invoiceId', 'pdfUrl', 'generatedAt'],
              properties: {
                invoiceId: {
                  type: 'string',
                  description: 'The invoice ID',
                  example: 'in_1234567890',
                },
                pdfUrl: {
                  type: 'string',
                  description: 'Temporary download URL for the PDF',
                  example:
                    'https://pay.stripe.com/invoice/acct_1ABC/in_1234567890/pdf',
                },
                generatedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Timestamp when the PDF URL was generated',
                  example: '2026-05-04T12:00:00.000Z',
                },
                expiresAt: {
                  type: 'string',
                  format: 'date-time',
                  description:
                    'Timestamp when the PDF URL expires (if provided by the provider)',
                  example: '2026-05-04T12:30:00.000Z',
                  nullable: true,
                },
              },
            },
          },
        },
      },
      [STATUS_CODE.NOT_FOUND]: {
        description: 'Invoice not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'number',
                      example: STATUS_CODE.NOT_FOUND,
                    },
                    message: {
                      type: 'string',
                      example: 'Invoice not found: in_1234567890',
                    },
                  },
                },
              },
            },
          },
        },
      },
      [STATUS_CODE.BAD_REQUEST]: {
        description: 'PDF URL not available',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'number',
                      example: STATUS_CODE.BAD_REQUEST,
                    },
                    message: {
                      type: 'string',
                      example:
                        'PDF URL not available for invoice in_123. The invoice may be in draft status or not finalized.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async getInvoicePdf(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<TInvoicePdf> {
    const pdfInfo: TInvoicePdf =
      await this.billingService.getInvoicePdf(invoiceId);
    return pdfInfo;
  }

  /**
   * Get payment details for an invoice.
   *
   * Returns information about the payment method used, payment amount,
   * payment date, and transaction status.
   *
   * Example response:
   * ```json
   * {
   *   "invoiceId": "in_1234567890",
   *   "paymentMethod": {
   *     "type": "card",
   *     "card": {
   *       "brand": "visa",
   *       "last4": "4242",
   *       "expMonth": 12,
   *       "expYear": 2025
   *     }
   *   },
   *   "paymentDate": 1714834567,
   *   "amount": 5000,
   *   "currency": "usd",
   *   "status": "succeeded"
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/invoices/{invoiceId}/payment-details`, {
    summary: 'Get payment details for an invoice',
    description:
      'Retrieves payment method details, payment amount, status, and ' +
      'transaction information for a specific invoice.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment details retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['invoiceId', 'paymentMethod'],
              properties: {
                invoiceId: {type: 'string', example: 'in_1234567890'},
                paymentMethod: {
                  type: 'object',
                  properties: {
                    type: {type: 'string', example: 'card'},
                    card: {
                      type: 'object',
                      properties: {
                        brand: {type: 'string', example: 'visa'},
                        last4: {type: 'string', example: '4242'},
                        expMonth: {type: 'number', example: 12},
                        expYear: {type: 'number', example: 2025},
                        funding: {type: 'string', example: 'credit'},
                      },
                    },
                  },
                },
                paymentDate: {type: 'number', example: 1714834567},
                amount: {type: 'number', example: 5000},
                currency: {type: 'string', example: 'usd'},
                status: {type: 'string', example: 'succeeded'},
              },
            },
          },
        },
      },
      [STATUS_CODE.NOT_FOUND]: {
        description: 'Invoice not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'number',
                      example: STATUS_CODE.NOT_FOUND,
                    },
                    message: {
                      type: 'string',
                      example: 'Invoice not found: in_1234567890',
                    },
                  },
                },
              },
            },
          },
        },
      },
      [STATUS_CODE.BAD_REQUEST]: {
        description: 'No payment details available',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'number',
                      example: STATUS_CODE.BAD_REQUEST,
                    },
                    message: {
                      type: 'string',
                      example:
                        'No payment found for invoice. The invoice may not be paid yet.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async getInvoicePaymentDetails(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<TInvoicePaymentDetails> {
    return this.billingService.getInvoicePaymentDetails(invoiceId);
  }

  /**
   * Get payment intent details by ID.
   *
   * Returns comprehensive payment tracking information including status,
   * payment method, amount, and transaction metadata.
   *
   * Example response:
   * ```json
   * {
   *   "id": "pi_1234567890",
   *   "amount": 5000,
   *   "currency": "usd",
   *   "status": "succeeded",
   *   "created": 1714834567,
   *   "customer": "cus_XXXXX",
   *   "paymentMethod": {
   *     "type": "card",
   *     "card": {
   *       "brand": "visa",
   *       "last4": "4242"
   *     }
   *   },
   *   "description": "Payment for order #12345"
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/payment-intents/{paymentIntentId}`, {
    summary: 'Get payment intent details',
    description:
      'Retrieves detailed information about a payment intent including ' +
      'status, payment method, amount, and transaction metadata. ' +
      'Useful for payment tracking and webhook handling.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment intent retrieved successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['id', 'amount', 'currency', 'status', 'created'],
              properties: {
                id: {type: 'string', example: 'pi_1234567890'},
                amount: {type: 'number', example: 5000},
                currency: {type: 'string', example: 'usd'},
                status: {type: 'string', example: 'succeeded'},
                created: {type: 'number', example: 1714834567},
                customer: {type: 'string', example: 'cus_XXXXX'},
                paymentMethod: {
                  type: 'object',
                  properties: {
                    type: {type: 'string', example: 'card'},
                    card: {
                      type: 'object',
                      properties: {
                        brand: {type: 'string', example: 'visa'},
                        last4: {type: 'string', example: '4242'},
                      },
                    },
                  },
                },
                description: {
                  type: 'string',
                  example: 'Payment for order #12345',
                },
                metadata: {
                  type: 'object',
                  additionalProperties: {type: 'string'},
                },
              },
            },
          },
        },
      },
      [STATUS_CODE.NOT_FOUND]: {
        description: 'Payment intent not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    statusCode: {
                      type: 'number',
                      example: STATUS_CODE.NOT_FOUND,
                    },
                    message: {
                      type: 'string',
                      example: 'Payment intent not found: pi_1234567890',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async getPaymentIntent(
    @param.path.string('paymentIntentId') paymentIntentId: string,
  ): Promise<TPaymentIntent> {
    return this.billingService.getPaymentIntent(paymentIntentId);
  }
}
