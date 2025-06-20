import {BillingComponentBindings, IService} from 'loopback4-billing';
import {inject} from '@loopback/core';
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
import {InvoiceDto} from '../models/dto/invoice-dto.model';
import {TransactionDto} from '../models/dto/transaction-dto.model';
import {PermissionKey} from '../permissions';
import {BillingInvoiceService} from '../services/billing-invoice.service';

const basePath = '/billing-invoice';
export class BillingInvoiceController {
  constructor(
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
    @inject('services.BillingInvoiceService')
    private readonly billingInvoiceService: BillingInvoiceService,
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
    return this.billingInvoiceService.createInvoice(invoiceDto);
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
    return this.billingInvoiceService.getInvoice(invoiceId);
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
    return this.billingInvoiceService.applyPayment(invoiceId, transactionDto);
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
    return this.billingInvoiceService.deleteInvoice(invoiceId);
  }
}
