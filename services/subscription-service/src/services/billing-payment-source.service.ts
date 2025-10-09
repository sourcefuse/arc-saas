import {BindingScope, inject, injectable} from '@loopback/context';
import {PaymentSourceDto} from '../models';
import {BillingComponentBindings, IService} from 'loopback4-billing';
import {repository} from '@loopback/repository';
import {BillingCustomerRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class BillingPaymentSourceService {
  constructor(
    @repository(BillingCustomerRepository)
    private readonly billingCustomerRepository: BillingCustomerRepository,
    @inject(BillingComponentBindings.BillingProvider)
    private readonly billingProvider: IService,
  ) {}
  async createPaymentSource(
    paymentSourceDto: PaymentSourceDto,
  ): Promise<PaymentSourceDto> {
    const customer = await this.billingCustomerRepository.find({
      where: {customerId: paymentSourceDto.customerId},
    });

    if (!customer.length) {
      throw new Error('Customer with tenantId is not present');
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

  async getPaymentSource(paymentSourceId: string): Promise<PaymentSourceDto> {
    const paymentSource =
      await this.billingProvider.retrievePaymentSource(paymentSourceId);

    return new PaymentSourceDto({
      id: paymentSource.id,
      customerId: paymentSource.customerId,
      card: paymentSource.card,
    });
  }

  async deletePaymentSource(paymentSourceId: string): Promise<void> {
    const customer = await this.billingCustomerRepository.find({
      where: {paymentSourceId: paymentSourceId},
    });

    if (!customer.length) {
      throw new Error('Customer with tenantId is not present');
    }

    await this.billingProvider.deletePaymentSource(paymentSourceId);
    await this.billingCustomerRepository.updateById(customer[0].id, {
      paymentSourceId: undefined,
    });
  }
}
