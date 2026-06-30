import {model, Model, property} from '@loopback/repository';

@model({name: 'invoice_payment_details_dto'})
export class InvoicePaymentDetailsDto extends Model {
  @property({type: 'string'})
  invoiceId: string;

  @property({type: 'object'})
  paymentMethod: object;

  @property({type: 'number'})
  paymentDate?: number;

  @property({type: 'number'})
  amount?: number;

  @property({type: 'string'})
  currency?: string;

  @property({type: 'string'})
  status?: string;

  constructor(data?: Partial<InvoicePaymentDetailsDto>) {
    super(data);
  }
}
