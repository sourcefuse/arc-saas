import {Entity, model, property} from '@loopback/repository';
import {Options} from 'loopback4-billing';

@model()
export class AddressDto extends Entity {
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
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  company?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'string',
    required: true,
  })
  zip: string;

  @property({
    type: 'string',
    required: true,
  })
  country: string;

  @property({
    type: 'object',
  })
  options?: Options;

  constructor(data?: Partial<AddressDto>) {
    super(data);
  }
}
