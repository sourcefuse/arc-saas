import {model, Model, property} from '@loopback/repository';

@model({name: 'invoice_price_dto'})
export class InvoicePriceDto extends Model {
  @property({type: 'string'})
  currency: string;

  @property({type: 'number'})
  totalAmount: number;

  @property({type: 'number'})
  taxAmount: number;

  @property({type: 'number'})
  amountExcludingTax: number;

  constructor(data?: Partial<InvoicePriceDto>) {
    super(data);
  }
}
