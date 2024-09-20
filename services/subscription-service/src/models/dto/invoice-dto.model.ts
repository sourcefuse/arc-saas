import {model, Model, property} from '@loopback/repository';
import {Options} from 'loopback4-billing';
import {AddressDto} from './address-dto.model';
import {ChargeDto} from './charge-dto.model';
import {InvoiceStatus} from '../../types';

@model({
  name: 'invoice_dto',
})
export class InvoiceDto extends Model {
  @property({
    type: 'string',
    name: 'id',
  })
  id?: string;

  @property({
    type: 'string',
    name: 'customer_id',
  })
  customerId: string;

  @property({
    type: 'object',
  })
  options?: Options;

  @property({
    type: AddressDto,
    name: 'shipping_address',
  })
  shippingAddress: AddressDto;

  @property({
    type: 'array',
    itemType: ChargeDto,
    name: 'charges',
  })
  charges: ChargeDto[];

  @property({
    type: 'string',
    name: 'status',
  })
  status?: InvoiceStatus;

  constructor(data?: Partial<InvoiceDto>) {
    super(data);
  }
}
