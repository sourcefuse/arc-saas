import {getJsonSchema} from '@loopback/openapi-v3';
import {model, property} from '@loopback/repository';
import {Address} from '../address.model';
import {Lead} from '../lead.model';

@model({
  description: 'model describing payload used to create a lead',
})
export class CreateLeadDTO extends Lead {
  @property({
    type: 'object',
    description: 'address object to be created for the lead',
    jsonSchema: getJsonSchema(Address, {
      exclude: ['id'],
      optional: ['country'],
    }),
  })
  address?: Partial<Omit<Address, 'id'>>;

  constructor(data?: Partial<CreateLeadDTO>) {
    super(data);
  }
}
