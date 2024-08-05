import {repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKey} from '../permissions';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';
import {inject} from '@loopback/core';
import {BillingComponentBindings, IService} from 'local-billing';
import {CustomerDto} from '../models/dto/customer-dto.model';
import {InvoiceDto} from '../models/dto/invoice-dto.model';
import {PaymentSourceDto} from '../models/dto/payment-dto.model';
import {BillingCustomer} from '../models/billing-customer.model';

const basePath = '/billing-customer';
export class BillingCustomerController {
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
    permissions: [PermissionKey.CreateBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCustomer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CustomerDto, {
              title: 'NewBillingCustomer',
            }),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerDto, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customerDto: Omit<CustomerDto, 'id'>,
    @param.header.string('tenantId') tenantId: string,
  ): Promise<CustomerDto> {
    const customer = await this.billingProvider.createCustomer(customerDto);
    await this.billingCustomerRepository.create(
      new BillingCustomer({
        tenantId,
        customerId: customer.id,
      }),
    );
    return customer;
  }

  @authorize({
    permissions: [PermissionKey.GetBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCustomer model ',
        content: {'application/json': {schema: getModelSchemaRef(CustomerDto)}},
      },
    },
  })
  async getCustomer(
    @param.header.string('tenantId') tenantId: string,
  ): Promise<CustomerDto> {
    const customer = await this.billingCustomerRepository.find({
      where: {
        tenantId: tenantId,
      },
    });
    if (customer.length == 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    return this.billingProvider.getCustomers(customer[0].customerId);
  }

  @authorize({
    permissions: [PermissionKey.UpdateBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{tenantId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCustomer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('tenantId') tenantId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerDto, {partial: true}),
        },
      },
    })
    customerDto: Partial<CustomerDto>,
  ): Promise<void> {
    await this.billingProvider.updateCustomerById(tenantId, customerDto);
  }

  @authorize({
    permissions: [PermissionKey.DeleteBillingCustomer],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{tenantId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCustomer DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('tenantId') tenantId: string,
  ): Promise<void> {
    const customer = await this.billingCustomerRepository.find({
      where: {tenantId: tenantId},
    });
    if (customer.length == 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    await this.billingProvider.deleteCustomer(customer[0].customerId);
    await this.billingCustomerRepository.deleteById(customer[0].id);
  }
}
