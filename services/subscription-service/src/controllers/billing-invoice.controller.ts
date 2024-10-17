import {BillingComponentBindings, IService} from 'loopback4-billing';
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
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {AddressDto, ChargeDto} from '../models';
import {InvoiceDto} from '../models/dto/invoice-dto.model';
import {TransactionDto} from '../models/dto/transaction-dto.model';
import {PermissionKey} from '../permissions';
import {InvoiceRepository} from '../repositories';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';

const basePath = '/billing-invoice';
export class BillingInvoiceController {
  constructor(
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
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
      where: {customerId: invoiceDto.customerId},
    });

    if (customer.length === 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    const invoice = await this.billingProvider.createInvoice(invoiceDto);
    const charges = invoice.charges?.map(
      charge =>
        new ChargeDto({amount: charge.amount, description: charge.description}),
    );

    const invoiceInfo = await this.invoiceRepository.create({
      invoiceId: invoice.id,
      invoiceStatus: invoice.status,
      billingCustomerId: customer[0].id,
    });
    return new InvoiceDto({
      id: invoiceInfo.id, // passed the id of invoice info created in our db, to setup relation between subscription and invoice
      customerId: invoice.customerId,
      charges: charges,
      status: invoice.status,
      shippingAddress: new AddressDto({
        firstName: invoice.shippingAddress?.firstName ?? '',
        lastName: invoice.shippingAddress?.lastName ?? '',
        email: invoice.shippingAddress?.email ?? '',
        company: invoice.shippingAddress?.company,
        phone: invoice.shippingAddress?.phone,
        city: invoice.shippingAddress?.city ?? '',
        state: invoice.shippingAddress?.state ?? '',
        zip: invoice.shippingAddress?.zip ?? '',
        country: invoice.shippingAddress?.country ?? '',
      }),
      options: invoice.options,
      currencyCode: invoice.currencyCode,
    });
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
    const invoice = await this.billingProvider.retrieveInvoice(invoiceId);
    const charges = invoice.charges?.map(
      charge =>
        new ChargeDto({amount: charge.amount, description: charge.description}),
    );
    return new InvoiceDto({
      customerId: invoice.customerId,
      charges: charges,
      status: invoice.status,
      shippingAddress: new AddressDto({
        firstName: invoice.shippingAddress?.firstName ?? '',
        lastName: invoice.shippingAddress?.lastName ?? '',
        email: invoice.shippingAddress?.email ?? '',
        company: invoice.shippingAddress?.company,
        phone: invoice.shippingAddress?.phone,
        city: invoice.shippingAddress?.city ?? '',
        state: invoice.shippingAddress?.state ?? '',
        zip: invoice.shippingAddress?.zip ?? '',
        country: invoice.shippingAddress?.country ?? '',
      }),
      options: invoice.options,
    });
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
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionDto, {partial: true}),
        },
      },
    })
    transactionDto: TransactionDto,
  ): Promise<void> {
    const invoiceInfo = await this.invoiceRepository.findById(invoiceId);
    await this.billingProvider.applyPaymentSourceForInvoice(
      invoiceInfo.invoiceId,
      transactionDto,
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
    const invoice = await this.invoiceRepository.find({
      where: {invoiceId: invoiceId},
    });
    if (invoice.length === 0)
      throw new Error(' invoice with invoiceId is not present');
    await this.billingProvider.deleteInvoice(invoiceId);
    await this.invoiceRepository.deleteById(invoice[0].id);
  }
}
