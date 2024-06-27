import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {InvoiceRepository} from '../repositories';
import {Invoice} from '../models';
import {PermissionKey} from '../permissions';
import {service} from '@loopback/core';
import {InvoicePDFGenerator} from '../services';

const basePath = '/invoices';

export class InvoiceController {
  constructor(
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
    @service(InvoicePDFGenerator)
    private invoicePDFGenerator: InvoicePDFGenerator,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice model instance POST success',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Invoice)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Invoice, {
            title: 'NewInvoice',
            exclude: ['id'],
          }),
        },
      },
    })
    invoice: Omit<Invoice, 'id'>,
  ): Promise<Invoice> {
    const createdInvoice = await this.invoiceRepository.create(invoice);
    return createdInvoice;
  }

  @authorize({
    permissions: [PermissionKey.CreateInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/download`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Invoice download success',
      },
    },
  })
  async downloadInvoice(@param.path.number('id') id: string): Promise<void> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new Error('Invoice with given id does not exist');
    }
    // Generate PDF invoice
    try {
      const pdfFilePath = await this.invoicePDFGenerator.generatePDF(invoice);
      invoice.invoiceFile = pdfFilePath; // Assuming invoiceFile property stores the path to the generated PDF
      // Update invoice record in the database to store the PDF file path
      await this.invoiceRepository.updateById(invoice.id, invoice);
    } catch (error) {
      //sonarignore:start
      console.error('Error generating PDF:', error);
      //sonarignore:end
      // Handle error appropriately
    }
  }

  @authorize({
    permissions: [PermissionKey.ViewInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Invoice) where?: Where<Invoice>): Promise<Count> {
    return this.invoiceRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Invoice model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Invoice, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Invoice) filter?: Filter<Invoice>,
  ): Promise<Invoice[]> {
    return this.invoiceRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Invoice),
          },
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Invoice, {partial: true}),
        },
      },
    })
    invoice: Invoice,
    @param.where(Invoice) where?: Where<Invoice>,
  ): Promise<Count> {
    return this.invoiceRepository.updateAll(invoice, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Invoice model instance success',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Invoice)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Invoice, {exclude: 'where'})
    filter?: Filter<Invoice>,
  ): Promise<Invoice> {
    return this.invoiceRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Invoice PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Invoice),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Invoice, {partial: true}),
        },
      },
    })
    invoice: Invoice,
  ): Promise<void> {
    await this.invoiceRepository.updateById(id, invoice);
  }

  @authorize({
    permissions: [PermissionKey.UpdateInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Invoice PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() invoice: Invoice,
  ): Promise<void> {
    await this.invoiceRepository.replaceById(id, invoice);
  }

  @authorize({
    permissions: [PermissionKey.DeleteInvoice],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Invoice DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.invoiceRepository.deleteById(id);
  }
}
