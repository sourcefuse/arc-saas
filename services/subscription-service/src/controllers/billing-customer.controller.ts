import {BillingComponentBindings, IService} from 'loopback4-billing';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
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
import {AddressDto} from '../models';
import {BillingCustomer} from '../models/billing-customer.model';
import {CustomerDto} from '../models/dto/customer-dto.model';
import {PermissionKey} from '../permissions';
import {InvoiceRepository} from '../repositories';
import {BillingCustomerRepository} from '../repositories/billing-customer.repository';

const basePath = '/billing-customer';
export class BillingCustomerController {
  constructor(
    @repository(BillingCustomerRepository)
    public billingCustomerRepository: BillingCustomerRepository,
    @repository(InvoiceRepository)
    public invoiceRepository: InvoiceRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateBillingCustomer],
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
    return new CustomerDto({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      company: customer.company,
      phone: customer.phone,
      billingAddress: new AddressDto({
        firstName: customer.billingAddress?.firstName,
        lastName: customer.billingAddress?.lastName,
        email: customer.billingAddress?.email,
        company: customer.billingAddress?.company,
        phone: customer.billingAddress?.phone,
        city: customer.billingAddress?.city,
        state: customer.billingAddress?.state,
        zip: customer.billingAddress?.zip,
        country: customer.billingAddress?.country,
      }),
    });
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
    @param.filter(BillingCustomer) filter?: Filter<BillingCustomer>,
  ): Promise<{customerDetails: CustomerDto; info: BillingCustomer}> {
    const customers = await this.billingCustomerRepository.find(filter);
    if (customers.length === 0) {
      throw new Error('Customer is not present');
    }

    const customer = await this.billingProvider.getCustomers(
      customers[0].customerId,
    );
    return {
      customerDetails: new CustomerDto({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        company: customer.company,
        phone: customer.phone,
        billingAddress: new AddressDto({
          firstName: customer.billingAddress?.firstName,
          lastName: customer.billingAddress?.lastName,
          email: customer.billingAddress?.email,
          company: customer.billingAddress?.company,
          phone: customer.billingAddress?.phone,
          city: customer.billingAddress?.city,
          state: customer.billingAddress?.state,
          zip: customer.billingAddress?.zip,
          country: customer.billingAddress?.country,
        }),
      }),
      info: customers[0],
    };
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
    const customers = await this.billingCustomerRepository.find({
      where: {tenantId: tenantId},
    });

    if (customers.length === 0) {
      throw new Error(`Customer with tenantId ${tenantId} is not present`);
    }
    await this.billingProvider.updateCustomerById(
      customers[0].customerId,
      customerDto,
    );
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
    if (customer.length === 0) {
      throw new Error(' Customer with tenantId is not present');
    }
    await this.billingProvider.deleteCustomer(customer[0].customerId);
    await this.invoiceRepository.deleteAll({billingCustomerId: customer[0].id});
    await this.billingCustomerRepository.deleteById(customer[0].id);
  }
}
