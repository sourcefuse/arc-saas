import {inject} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {
  BillingComponentBindings,
  IService,
  TInvoicePdf,
  TInvoicePaymentDetails,
  TPaymentIntent,
} from 'loopback4-billing';
import {
  getModelSchemaRefSF,
  STATUS_CODE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {BillingPaymentStatusResponse, BillingErrorResponse} from '../models';
import {
  InvoicePdfDto,
  InvoicePaymentDetailsDto,
  PaymentIntentDto,
} from '../models/dto';
import {PermissionKey} from '../permissions';

const BASE = '/billing';

export class BillingServiceController {
  constructor(
    @inject(BillingComponentBindings.SDKProvider)
    private readonly billingService: IService,
  ) {}

  /**
   * Check whether an invoice has been paid.
   */
  @authorize({permissions: [PermissionKey.ViewInvoice]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/invoices/{invoiceId}/payment-status`, {
    security: OPERATION_SECURITY_SPEC,
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

  @authorize({permissions: [PermissionKey.ViewInvoice]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/invoices/{invoiceId}/pdf`, {
    security: OPERATION_SECURITY_SPEC,
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
            schema: getModelSchemaRefSF(InvoicePdfDto),
          },
        },
      },
      [STATUS_CODE.NOT_FOUND]: {
        description: 'Invoice not found',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(BillingErrorResponse),
          },
        },
      },
      [STATUS_CODE.BAD_REQUEST]: {
        description: 'PDF URL not available',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(BillingErrorResponse),
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

  @authorize({permissions: [PermissionKey.ViewInvoice]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/invoices/{invoiceId}/payment-details`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Get payment details for an invoice',
    description:
      'Retrieves payment method details, payment amount, status, and ' +
      'transaction information for a specific invoice.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment details retrieved successfully',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(InvoicePaymentDetailsDto),
          },
        },
      },
      [STATUS_CODE.NOT_FOUND]: {
        description: 'Invoice not found',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(BillingErrorResponse),
          },
        },
      },
      [STATUS_CODE.BAD_REQUEST]: {
        description: 'No payment details available',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(BillingErrorResponse),
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

  @authorize({permissions: [PermissionKey.ViewInvoice]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/payment-intents/{paymentIntentId}`, {
    security: OPERATION_SECURITY_SPEC,
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
            schema: getModelSchemaRefSF(PaymentIntentDto),
          },
        },
      },
      [STATUS_CODE.NOT_FOUND]: {
        description: 'Payment intent not found',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(BillingErrorResponse),
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
