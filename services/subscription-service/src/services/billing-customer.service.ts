import {Filter, repository} from '@loopback/repository';
import {AddressDto, CustomerDto} from '../models';
import {BillingCustomer} from '../models/billing-customer.model';
import {InvoiceRepository, BillingCustomerRepository} from '../repositories';
import {BindingScope, inject, injectable} from '@loopback/context';
import {BillingComponentBindings, IService, TCustomer} from 'loopback4-billing';
@injectable({scope: BindingScope.TRANSIENT})
export class BillingCustomerService {
  constructor(
    @repository(BillingCustomerRepository)
    private readonly billingCustomerRepo: BillingCustomerRepository,
    @repository(InvoiceRepository)
    private readonly invoiceRepo: InvoiceRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
  ) {}
  async createCustomer(
    customerDto: Omit<CustomerDto, 'id'>,
    tenantId: string,
  ): Promise<CustomerDto> {
    const customer = await this.billingProvider.createCustomer(customerDto);
    await this.billingCustomerRepo.create(
      new BillingCustomer({
        tenantId,
        customerId: customer.id,
      }),
    );
    return this.mapToCustomerDto(customer);
  }
  private mapToCustomerDto(customer: TCustomer): CustomerDto {
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

  async getCustomer(
    filter?: Filter<BillingCustomer>,
  ): Promise<{customerDetails: CustomerDto; info: BillingCustomer}> {
    const customers = await this.billingCustomerRepo.find(filter);
    if (customers.length === 0) {
      throw new Error('Customer is not present');
    }

    const customer = await this.billingProvider.getCustomers(
      customers[0].customerId,
    );
    return {
      customerDetails: this.mapToCustomerDto(customer),
      info: customers[0],
    };
  }

  async updateCustomerByTenantId(
    tenantId: string,
    customerDto: Partial<CustomerDto>,
  ): Promise<void> {
    const customers = await this.billingCustomerRepo.find({
      where: {tenantId},
    });

    if (customers.length === 0) {
      throw new Error(`Customer with tenantId ${tenantId} is not present`);
    }

    await this.billingProvider.updateCustomerById(
      customers[0].customerId,
      customerDto,
    );
  }

  async deleteCustomerByTenantId(tenantId: string): Promise<void> {
    const customer = await this.billingCustomerRepo.find({
      where: {tenantId},
    });

    if (customer.length === 0) {
      throw new Error('Customer with tenantId is not present');
    }

    await this.billingProvider.deleteCustomer(customer[0].customerId);
    await this.invoiceRepo.deleteAll({billingCustomerId: customer[0].id});
    await this.billingCustomerRepo.deleteById(customer[0].id);
  }
}
