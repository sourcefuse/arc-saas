import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Tenant} from './tenant.model';

@model({
  name: 'contacts',
  description: 'contacts belonging to a tenant',
})
export class Contact extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'first_name',
    required: true,
    description: 'first name of the lead',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
    required: true,
    description: 'last name of the lead',
  })
  lastName: string;

  @property({
    type: 'string',
    description: 'email id of the contact',
    required: true,
  })
  email: string;

  @property({
    name: 'is_primary',
    type: 'boolean',
    description:
      "boolean value denoting if the contact is a primary contact for it's tenant.",
    required: true,
  })
  isPrimary: boolean;

  @property({
    name: 'contact_type',
    type: 'string',
    description: 'type of the contact',
  })
  type?: string;

  @belongsTo(
    () => Tenant,
    {name: 'tenant'},
    {
      name: 'tenant_id',
      description: 'tenant id this contact belongs to',
    },
  )
  tenantId: string;

  constructor(data?: Partial<Contact>) {
    super(data);
  }
}

export interface ContactRelations {
  // describe navigational properties here
}

export type ContactWithRelations = Contact & ContactRelations;
