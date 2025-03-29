import {getJsonSchema} from '@loopback/openapi-v3';
import {Model, model, property} from '@loopback/repository';
import {Contact} from '../contact.model';

@model({
  description: 'model describing payload used to create and onboard a tenant',
})
export class TenantOnboardDTO extends Model {
  @property({
    type: 'object',
    description:
      'metadata for the contact to be created, it is required when tenant is created without a lead',
    jsonSchema: getJsonSchema(Contact, {
      exclude: ['tenantId', 'id'],
    }),
  })
  contact: Omit<Contact, 'id' | 'tenantId'>;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    description: 'address of the tenant owners',
  })
  address?: string;

  @property({
    type: 'string',
    description: 'city of the tenant owner',
  })
  city?: string;

  @property({
    description: 'state of the tenant owner',
    type: 'string',
  })
  state?: string;

  @property({
    description: 'zip code of the tenant owner',
    type: 'string',
  })
  zip?: string;

  @property({
    type: 'string',
    description: 'country of the tenant owner',
  })
  country?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^[a-z0-9]+$',
      maxLength: 10,
    },
  })
  key: string;

  @property({
    required: true,
    jsonSchema: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        format: 'hostname',
      },
    },
  })
  domains: string[];

  constructor(data?: Partial<TenantOnboardDTO>) {
    super(data);
  }
}
