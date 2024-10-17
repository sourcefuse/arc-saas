import {BillingComponentBindings, IService} from 'loopback4-billing';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
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
import {InvoiceRepository} from '../repositories';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';

const basePath = '/billing-payment-source';
export class BillingPaymentSourceController {
  constructor(
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
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
    const customer = await this.billingCustomerRepository.find({
      where: {customerId: paymentSourceDto.customerId},
    });

    if (customer.length === 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    const paymentSource =
      await this.billingProvider.createPaymentSource(paymentSourceDto);
    await this.billingCustomerRepository.updateById(customer[0].id, {
      paymentSourceId: paymentSource.id,
    });
    return new PaymentSourceDto({
      id: paymentSource.id,
      customerId: paymentSource.customerId,
      card: paymentSource.card,
    });
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
    const paymentSource =
      await this.billingProvider.retrievePaymentSource(paymentSourceId);
    return new PaymentSourceDto({
      id: paymentSource.id,
      customerId: paymentSource.customerId,
      card: paymentSource.card,
    });
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
    const customer = await this.billingCustomerRepository.find({
      where: {paymentSourceId: paymentSourceId},
    });

    if (customer.length === 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    await this.billingProvider.deletePaymentSource(paymentSourceId);
    await this.billingCustomerRepository.updateById(customer[0].id, {
      paymentSourceId: undefined,
    });
  }
}
