import {model, Model, property} from '@loopback/repository';
import {AddressDto} from './address-dto.model';
import {Options} from 'loopback4-billing';

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
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

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
  billingAddress: AddressDto;

  @property({
    type: 'object',
  })
  options?: Options;

  constructor(data?: Partial<CustomerDto>) {
    super(data);
  }
}
