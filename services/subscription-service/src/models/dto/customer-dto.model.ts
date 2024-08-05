import {model, Model, property} from '@loopback/repository';
import {AddressDto} from './address-dto.model';

@model({
  name: 'customer_dto',
})
export class CustomerDto extends Model {
  @property({
    type: 'string',
    name: 'id',
  })
  id?: string;

  @property({
    type: 'string',
    name: 'first_name',
  })
  first_name: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  last_name: string;

  @property({
    type: 'string',
    name: 'email',
  })
  email: string;

  @property({
    type: 'string',
    name: 'company',
  })
  company: string;

  @property({
    type: 'string',
    name: 'phone',
  })
  phone: string;

  @property({
    type: AddressDto,
    name: 'billing_address',
  })
  billing_address: AddressDto;

  constructor(data?: Partial<CustomerDto>) {
    super(data);
  }
}

// this refers to the billing address and shipping address.
export interface IAddress {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  city: string;
  state: string;
  zip: string;
  coutnry: string;
}
