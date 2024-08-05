import {Entity, model, property} from '@loopback/repository';

@model()
export class AddressDto extends Entity {
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
  })
  line1?: string;

  @property({
    type: 'string',
  })
  line2?: string;

  @property({
    type: 'string',
  })
  line3?: string;

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

  constructor(data?: Partial<AddressDto>) {
    super(data);
  }
}

export interface AddressRelations {
  // describe navigational properties here
}

export type AddressWithRelations = AddressDto & AddressRelations;
