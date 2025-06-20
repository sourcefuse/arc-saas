import {inject} from '@loopback/core';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PaymentSourceDto} from '../models/dto/payment-dto.model';
import {PermissionKey} from '../permissions';
import {BillingPaymentSourceService} from '../services/billing-payment-source.service';

const basePath = '/billing-payment-source';
export class BillingPaymentSourceController {
  constructor(
    @inject('services.BillingPaymentSourceService')
    private readonly billingPaymentSourceService: BillingPaymentSourceService,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateBillingPaymentSource],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Payment model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(PaymentSourceDto)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentSourceDto, {
            title: 'NewPaymentSource',
            exclude: ['id'],
          }),
        },
      },
    })
    paymentSourceDto: PaymentSourceDto,
  ): Promise<PaymentSourceDto> {
    return this.billingPaymentSourceService.createPaymentSource(
      paymentSourceDto,
    );
  }

  @authorize({
    permissions: [PermissionKey.GetBillingPaymentSource],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'get payment source',
        content: {
          'application/json': {schema: getModelSchemaRef(PaymentSourceDto)},
        },
      },
    },
  })
  async getPaymentSource(
    @param.path.string('paymentSourceId') paymentSourceId: string,
  ): Promise<PaymentSourceDto> {
    return this.billingPaymentSourceService.getPaymentSource(paymentSourceId);
  }

  @authorize({
    permissions: [PermissionKey.DeleteBillingPaymentSource],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{paymentSourceId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Billing Payment Source DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('paymentSourceId') paymentSourceId: string,
  ): Promise<void> {
    return this.billingPaymentSourceService.deletePaymentSource(
      paymentSourceId,
    );
  }
}
