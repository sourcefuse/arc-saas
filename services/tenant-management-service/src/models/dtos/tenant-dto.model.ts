import {getJsonSchema} from '@loopback/openapi-v3';
import {model, property} from '@loopback/repository';
import {Address} from '../address.model';
import {Lead} from '../lead.model';
import { Tenant } from '../tenant.model';
import { Contact } from '../contact.model';

@model({
  description: 'model describing payload used to create a lead',
})
export class TenantDto extends Tenant {
  @property({
    type: 'object',
    description: 'address object to be created for the lead',
    jsonSchema: getJsonSchema(Address),
  })
  address: Address;

  @property({
    type: 'array',
    itemType: 'object',
    description: 'Array of contact objects',
    jsonSchema: {
      type: 'object',
      items: getJsonSchema(Contact),
    },
  })
  contacts: Contact[];

  constructor(data?: Partial<TenantDto>) {
    super(data);
  }
}
