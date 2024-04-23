import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'addresses',
  description: 'this model represents the address of a company or lead',
})
export class Address extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    description: 'address of the company',
  })
  address?: string;

  @property({
    type: 'string',
    description: 'city of the company',
  })
  city?: string;

  @property({
    type: 'string',
    description: 'state of the company',
  })
  state?: string;

  @property({
    type: 'string',
    description: 'zip code of the company',
  })
  zip?: string;

  @property({
    type: 'string',
    description: 'country of the company',
    required: true,
  })
  country: string;

  constructor(data: Partial<Address>) {
    super(data);
  }
}
