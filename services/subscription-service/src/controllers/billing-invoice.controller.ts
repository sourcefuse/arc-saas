import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {BillingComponentBindings, IService} from 'local-billing';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {CustomerDto} from '../models/dto/customer-dto.model';
import {InvoiceDto} from '../models/dto/invoice-dto.model';
import {PaymentSourceDto} from '../models/dto/payment-dto.model';
import {PermissionKey} from '../permissions';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';

const basePath = '/billing-invoice';
export class BillingInvoiceController {
  constructor(
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService<
      CustomerDto,
      InvoiceDto,
      PaymentSourceDto,
      CustomerDto,
      InvoiceDto,
      PaymentSourceDto
    >,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateBillingInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'invoice model instance',
        content: {'application/json': {schema: getModelSchemaRef(InvoiceDto)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvoiceDto, {
            title: 'newInvoice',
            exclude: ['id', 'status'],
          }),
        },
      },
    })
    invoiceDto: Omit<InvoiceDto, 'id' | 'status'>,
  ): Promise<InvoiceDto> {
    const customer = await this.billingCustomerRepository.find({
      where: {customerId: invoiceDto.customer_id},
    });

    if (customer.length == 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    const invoice = await this.billingProvider.createInvoice(invoiceDto);
    await this.billingCustomerRepository.updateById(customer[0].id, {
      invoiceId: invoice.id,
      invoiceStatus: invoice.status,
    });
    return invoice;
  }

  @authorize({
    permissions: [PermissionKey.GetBillingInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{invoiceId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'get invoice',
        content: {'application/json': {schema: getModelSchemaRef(InvoiceDto)}},
      },
    },
  })
  async getInvoice(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<InvoiceDto> {
    return this.billingProvider.retrieveInvoice(invoiceId);
  }

  @authorize({
    permissions: [PermissionKey.UpdateBillingInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{invoiceId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Billing Invoice PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('invoiceId') invoiceId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InvoiceDto, {partial: true}),
        },
      },
    })
    invoiceDto: Partial<InvoiceDto>,
  ): Promise<void> {
    await this.billingProvider.updateInvoice(invoiceId, invoiceDto);
  }

  @authorize({
    permissions: [PermissionKey.CreateBillingInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(`${basePath}/{invoiceId}/payments`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'invoice model instance',
      },
    },
  })
  async applyPaymentForInvoice(
    @param.path.string('invoiceId') invoiceId: string,
    @param.header.string('paymentSourceId') paymentSourceId: string,
  ): Promise<void> {
    await this.billingProvider.applyPaymentSourceForInvoice(
      invoiceId,
      paymentSourceId,
    );
  }

  @authorize({
    permissions: [PermissionKey.DeleteBillingPaymentSource],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{invoiceId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Billing Invoice DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('invoiceId') invoiceId: string,
  ): Promise<void> {
    const customer = await this.billingCustomerRepository.find({
      where: {invoiceId: invoiceId},
    });

    if (customer.length == 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    await this.billingProvider.deleteInvoice(invoiceId);
    await this.billingCustomerRepository.updateById(customer[0].id, {
      invoiceId: undefined,
      invoiceStatus: undefined,
    });
  }
}
