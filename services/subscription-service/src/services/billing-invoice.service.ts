import {BindingScope, inject, injectable} from '@loopback/context';
import {AddressDto, ChargeDto, InvoiceDto} from '../models';
import {BillingComponentBindings, IService} from 'loopback4-billing';
import {repository} from '@loopback/repository';
import {InvoiceRepository, BillingCustomerRepository} from '../repositories';
import {TransactionDto} from '../models/dto/transaction-dto.model';

@injectable({scope: BindingScope.TRANSIENT})
export class BillingInvoiceService {
  constructor(
    @repository(BillingCustomerRepository)
    private readonly billingCustomerRepository: BillingCustomerRepository,
    @repository(InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
  ) {}
  async createInvoice(invoiceDto: Omit<InvoiceDto, 'id' | 'status'>) {
    const customer = await this.billingCustomerRepository.find({
      where: {customerId: invoiceDto.customerId},
    });

    if (customer.length === 0) {
      throw new Error('Customer with tenantId is not present');
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
      id: invoiceInfo.id,
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

  async getInvoice(invoiceId: string) {
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

  async applyPayment(invoiceId: string, transactionDto: TransactionDto) {
    const invoiceInfo = await this.invoiceRepository.findById(invoiceId);
    await this.billingProvider.applyPaymentSourceForInvoice(
      invoiceInfo.invoiceId,
      transactionDto,
    );
  }

  async deleteInvoice(invoiceId: string) {
    const invoice = await this.invoiceRepository.find({
      where: {invoiceId: invoiceId},
    });
    if (invoice.length === 0) {
      throw new Error('Invoice with invoiceId is not present');
    }
    await this.billingProvider.deleteInvoice(invoiceId);
    await this.invoiceRepository.deleteById(invoice[0].id);
  }
}
