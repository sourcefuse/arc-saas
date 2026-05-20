import {inject} from '@loopback/core';
import {
  del,
  get,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  BillingComponentBindings,
  IService,
  TInvoicePdf,
  TInvoicePaymentDetails,
  TPaymentIntent,
  TCustomer,
  TPaymentSource,
  TInvoice,
  Transaction,
} from 'loopback4-billing';
import {getModelSchemaRefSF, STATUS_CODE} from '@sourceloop/core';
import {
  BillingCustomerBody,
  BillingPaymentSourceBody,
  BillingPaymentMethodBody,
  BillingInvoiceBody,
  BillingUpdateInvoiceBody,
  BillingPaymentStatusResponse,
} from '../models';

const BASE = '/billing';

/**
 * Sandbox controller that exercises the full IService interface from
 * loopback4-billing — customer CRUD, payment source, and invoice management.
 *
 * Bound to BillingComponentBindings.SDKProvider (StripeService).
 */
export class BillingServiceController {
  constructor(
    @inject(BillingComponentBindings.SDKProvider)
    private readonly billingService: IService,
  ) {}

  // -------------------------------------------------------------------------
  // CUSTOMER
  // -------------------------------------------------------------------------

  /**
   * Create a new customer in Stripe.
   *
   * Example body:
   * ```json
   * {
   *   "firstName": "John",
   *   "lastName": "Doe",
   *   "email": "john.doe@example.com",
   *   "phone": "+1234567890"
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/customers`, {
    summary: 'Create a new customer',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Created customer object',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async createCustomer(
    @requestBody({
      content: {
        'application/json': {
          schema: {...getModelSchemaRefSF(BillingCustomerBody)},
        },
      },
    })
    customerDto: BillingCustomerBody,
  ): Promise<TCustomer> {
    return this.billingService.createCustomer(customerDto as TCustomer);
  }

  /**
   * Get a customer by external ID (Stripe customer ID, e.g. cus_XXXXX).
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/customers/{customerId}`, {
    summary: 'Get a customer by ID',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Customer object',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async getCustomer(
    @param.path.string('customerId') customerId: string,
  ): Promise<TCustomer> {
    return this.billingService.getCustomers(customerId);
  }

  /**
   * Update an existing customer (email, phone, billing address, etc.).
   *
   * Example body:
   * ```json
   * {
   *   "email": "new.email@example.com",
   *   "billingAddress": { "city": "New York", "country": "US" }
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @put(`${BASE}/customers/{customerId}`, {
    summary: 'Update a customer',
    responses: {
      [STATUS_CODE.NO_CONTENT]: {description: 'Customer updated'},
    },
  })
  async updateCustomer(
    @param.path.string('customerId') customerId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {...getModelSchemaRefSF(BillingCustomerBody)},
        },
      },
    })
    customerDto: Partial<BillingCustomerBody>,
  ): Promise<void> {
    await this.billingService.updateCustomerById(
      customerId,
      customerDto as Partial<TCustomer>,
    );
  }

  /**
   * Delete (permanently remove) a customer from Stripe.
   */
  @authorize({permissions: ['*']})
  @del(`${BASE}/customers/{customerId}`, {
    summary: 'Delete a customer',
    responses: {
      [STATUS_CODE.NO_CONTENT]: {description: 'Customer deleted'},
    },
  })
  async deleteCustomer(
    @param.path.string('customerId') customerId: string,
  ): Promise<void> {
    await this.billingService.deleteCustomer(customerId);
  }

  // -------------------------------------------------------------------------
  // PAYMENT SOURCE
  // -------------------------------------------------------------------------

  /**
   * Attach a payment method to a customer (via Stripe token).
   *
   * Example body:
   * ```json
   * {
   *   "customerId": "cus_XXXXX",
   *   "options": { "token": "tok_visa" }
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/payment-sources`, {
    summary: 'Create (attach) a payment source to a customer',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment source created',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async createPaymentSource(
    @requestBody({
      content: {
        'application/json': {
          schema: {...getModelSchemaRefSF(BillingPaymentSourceBody)},
        },
      },
    })
    paymentDto: BillingPaymentSourceBody,
  ): Promise<TPaymentSource> {
    return this.billingService.createPaymentSource(
      paymentDto as TPaymentSource,
    );
  }

  /**
   * Retrieve a payment source (payment method) by its ID.
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/payment-sources/{paymentSourceId}`, {
    summary: 'Retrieve a payment source by ID',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment source object',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async retrievePaymentSource(
    @param.path.string('paymentSourceId') paymentSourceId: string,
  ): Promise<TPaymentSource> {
    return this.billingService.retrievePaymentSource(paymentSourceId);
  }

  /**
   * Detach (delete) a payment source from a customer.
   */
  @authorize({permissions: ['*']})
  @del(`${BASE}/payment-sources/{paymentSourceId}`, {
    summary: 'Delete (detach) a payment source',
    responses: {
      [STATUS_CODE.NO_CONTENT]: {description: 'Payment source deleted'},
    },
  })
  async deletePaymentSource(
    @param.path.string('paymentSourceId') paymentSourceId: string,
  ): Promise<void> {
    await this.billingService.deletePaymentSource(paymentSourceId);
  }

  /**
   * Apply a payment to an invoice (pay out-of-band or via payment source).
   *
   * Example body for bank transfer:
   * ```json
   * {
   *   "paymentMethod": "bank_transfer",
   *   "comment": "Paid via wire transfer"
   * }
   * ```
   *
   * Example body for saved payment source:
   * ```json
   * {
   *   "paymentMethod": "payment_source",
   *   "paymentSourceId": "pm_XXXXX"
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/invoices/{invoiceId}/apply-payment`, {
    summary: 'Apply a payment to an invoice',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice after payment applied',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async applyPaymentSourceForInvoice(
    @param.path.string('invoiceId') invoiceId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {...getModelSchemaRefSF(BillingPaymentMethodBody)},
        },
      },
    })
    transaction: BillingPaymentMethodBody,
  ): Promise<TInvoice> {
    return this.billingService.applyPaymentSourceForInvoice(
      invoiceId,
      transaction as Transaction,
    );
  }

  // -------------------------------------------------------------------------
  // INVOICE (direct / one-time)
  // -------------------------------------------------------------------------

  /**
   * Create a one-time invoice for a customer with custom line items.
   *
   * Example body:
   * ```json
   * {
   *   "customerId": "cus_XXXXX",
   *   "currencyCode": "usd",
   *   "charges": [
   *     { "amount": 5000, "description": "Setup fee" },
   *     { "amount": 2000, "description": "Training" }
   *   ]
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @post(`${BASE}/invoices`, {
    summary: 'Create a one-time invoice with custom line items',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Created invoice object',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async createInvoice(
    @requestBody({
      content: {
        'application/json': {
          schema: {...getModelSchemaRefSF(BillingInvoiceBody)},
        },
      },
    })
    invoice: BillingInvoiceBody,
  ): Promise<TInvoice> {
    return this.billingService.createInvoice(invoice as TInvoice);
  }

  /**
   * Retrieve a specific invoice by ID.
   */
  @authorize({permissions: ['*']})
  @get(`${BASE}/invoices/{invoiceId}`, {
    summary: 'Retrieve an invoice by ID',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice object',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async retrieveInvoice(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<TInvoice> {
    return this.billingService.retrieveInvoice(invoiceId);
  }

  /**
   * Update the shipping address of an existing invoice.
   *
   * Example body:
   * ```json
   * {
   *   "customerId": "cus_XXXXX",
   *   "currencyCode": "usd",
   *   "shippingAddress": {
   *     "firstName": "John",
   *     "lastName": "Doe",
   *     "line1": "123 Main St",
   *     "city": "San Francisco",
   *     "state": "CA",
   *     "zip": "94107",
   *     "country": "US"
   *   }
   * }
   * ```
   */
  @authorize({permissions: ['*']})
  @put(`${BASE}/invoices/{invoiceId}`, {
    summary: 'Update an invoice (shipping address)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Updated invoice object',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async updateInvoice(
    @param.path.string('invoiceId') invoiceId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {...getModelSchemaRefSF(BillingUpdateInvoiceBody)},
        },
      },
    })
    invoice: BillingUpdateInvoiceBody,
  ): Promise<TInvoice> {
    return this.billingService.updateInvoice(
      invoiceId,
      invoice as Partial<TInvoice>,
    );
  }

  /**
   * Delete a draft invoice permanently.
   * Only draft invoices can be deleted in Stripe.
   */
  @authorize({permissions: ['*']})
  @del(`${BASE}/invoices/{invoiceId}`, {
    summary: 'Delete a draft invoice',
    responses: {
      [STATUS_CODE.NO_CONTENT]: {description: 'Invoice deleted'},
    },
  })
  async deleteInvoice(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<void> {
    await this.billingService.deleteInvoice(invoiceId);
  }

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

  // -------------------------------------------------------------------------
  // INVOICE PDF
  // -------------------------------------------------------------------------

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
  @response(STATUS_CODE.OK, {
    description: 'PDF information retrieved successfully',
  })
  async getInvoicePdf(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<TInvoicePdf> {
    const pdfInfo: TInvoicePdf =
      await this.billingService.getInvoicePdf(invoiceId);
    return pdfInfo;
  }

  // -------------------------------------------------------------------------
  // INVOICE PAYMENT DETAILS
  // -------------------------------------------------------------------------

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
  @response(STATUS_CODE.OK, {
    description: 'Payment details retrieved successfully',
  })
  async getInvoicePaymentDetails(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<TInvoicePaymentDetails> {
    return this.billingService.getInvoicePaymentDetails(invoiceId);
  }

  // -------------------------------------------------------------------------
  // PAYMENT INTENT OPERATIONS
  // -------------------------------------------------------------------------

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
  @response(STATUS_CODE.OK, {
    description: 'Payment intent retrieved successfully',
  })
  async getPaymentIntent(
    @param.path.string('paymentIntentId') paymentIntentId: string,
  ): Promise<TPaymentIntent> {
    return this.billingService.getPaymentIntent(paymentIntentId);
  }
}
