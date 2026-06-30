import {inject} from '@loopback/core';
import {del, get, param, post, put, requestBody} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {
  BillingComponentBindings,
  ISubscriptionService,
  TInvoicePrice,
  TPrice,
  TProduct,
  TSubscriptionCreate,
  TSubscriptionResult,
  TSubscriptionUpdate,
} from 'loopback4-billing';
import {
  getModelSchemaRefSF,
  STATUS_CODE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {PermissionKey} from '../permissions';
import {
  PriceDto,
  ProductDto,
  SubscriptionCreateDto,
  SubscriptionUpdateDto,
  SubscriptionResultDto,
  SubscriptionCreateResponseDto,
  SuccessDto,
  InvoicePriceDto,
} from '../models/dto';

const BASE = '/billing';

export class BillingSubscriptionController {
  constructor(
    @inject(BillingComponentBindings.SDKProvider)
    private readonly billingService: ISubscriptionService,
  ) {}

  @authorize({permissions: [PermissionKey.CreatePlan]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @post(`${BASE}/products`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Create a billing product (Item / Product)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'External product ID',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(ProductDto),
          },
        },
      },
    },
  })
  async createProduct(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(ProductDto, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
    product: TProduct,
  ): Promise<{productId: string}> {
    const productId = await this.billingService.createProduct(product);
    return {productId};
  }

  @authorize({permissions: [PermissionKey.ViewPlan]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/products/{productId}/exists`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Check if a billing product is active',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Existence flag',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SuccessDto),
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

  @authorize({permissions: [PermissionKey.CreatePlan]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @post(`${BASE}/prices`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Create a recurring price (ItemPrice / Price)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Created price / item-price object',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(PriceDto),
          },
        },
      },
    },
  })
  async createPrice(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(PriceDto, {
            title: 'NewPrice',
            exclude: ['id'],
          }),
        },
      },
    })
    price: TPrice,
  ): Promise<TPrice> {
    return this.billingService.createPrice(price);
  }

  @authorize({permissions: [PermissionKey.CreateSubscription]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @post(`${BASE}/subscriptions`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Create a new subscription',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Newly created subscription ID',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SubscriptionCreateResponseDto),
          },
        },
      },
    },
  })
  async createSubscription(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(SubscriptionCreateDto, {
            title: 'NewSubscription',
            exclude: [],
          }),
        },
      },
    })
    subscription: TSubscriptionCreate,
  ): Promise<{subscriptionId: string}> {
    const subscriptionId =
      await this.billingService.createSubscription(subscription);
    return {subscriptionId};
  }

  @authorize({permissions: [PermissionKey.ViewSubscription]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/subscriptions/{subscriptionId}`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Get a subscription by ID',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription object',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SubscriptionResultDto),
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

  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @put(`${BASE}/subscriptions/{subscriptionId}`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Upgrade / downgrade a subscription (plan change)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Updated subscription object',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SubscriptionResultDto),
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
          schema: getModelSchemaRefSF(SubscriptionUpdateDto, {
            title: 'SubscriptionUpdate',
            partial: true,
          }),
        },
      },
    })
    updates: TSubscriptionUpdate,
  ): Promise<TSubscriptionResult> {
    return this.billingService.updateSubscription(subscriptionId, updates);
  }

  @authorize({permissions: [PermissionKey.DeleteSubscription]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @del(`${BASE}/subscriptions/{subscriptionId}`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Cancel a subscription immediately',
    responses: {
      [STATUS_CODE.NO_CONTENT]: {description: 'Subscription cancelled'},
    },
  })
  async cancelSubscription(
    @param.path.string('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    await this.billingService.cancelSubscription(subscriptionId);
  }

  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @post(`${BASE}/subscriptions/{subscriptionId}/pause`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Pause a subscription',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription paused',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SuccessDto),
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

  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @post(`${BASE}/subscriptions/{subscriptionId}/resume`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Resume a paused subscription',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription resumed',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SuccessDto),
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

  @authorize({permissions: [PermissionKey.ViewInvoice]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @get(`${BASE}/invoices/{invoiceId}/price-details`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Get invoice price details (total, tax, subtotal)',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice price breakdown',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(InvoicePriceDto),
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

  @authorize({permissions: [PermissionKey.CreateInvoice]})
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @post(`${BASE}/invoices/{invoiceId}/send-payment-link`, {
    security: OPERATION_SECURITY_SPEC,
    summary: 'Send hosted payment link for an invoice',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment link sent',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(SuccessDto),
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
