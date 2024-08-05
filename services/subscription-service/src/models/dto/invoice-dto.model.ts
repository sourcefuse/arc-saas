import {model, Model, property} from '@loopback/repository';
import {AddressDto} from './address-dto.model';
import {ChargeDto} from './charge-dto.model';

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
  customer_id: string;

  @property({
    type: AddressDto,
    name: 'shipping_address',
  })
  shipping_address: AddressDto;

  @property({
    type: 'array',
    itemType: ChargeDto,
    name: 'charges',
  })
  charges: ChargeDto[];

  @property({
    type: 'string',
    name: 'auto_collection',
  })
  auto_collection?: string;

  @property({
    type: 'string',
    name: 'status',
  })
  status?: string;

  constructor(data?: Partial<InvoiceDto>) {
    super(data);
  }
}

// This refers to the item to be added in invoice.
// export interface ICharge{
//   amount:number;
//   description:string;
// }
