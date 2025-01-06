import {belongsTo, hasOne, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Tenant} from './tenant.model';
import {Address} from './address.model';

@model({
  name: 'leads',
  description:
    'this model represents a lead that could eventually be a tenant in the system',
})
export class Lead extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

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
    name: 'company_name',
    type: 'string',
    required: true,
    description: `name of the lead's company`,
  })
  companyName: string;

  @property({
    type: 'string',
    description: 'email of the lead',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    description: 'communication email id of the contact',
    name: 'communication_email',
  })
  communicationEmail?: string;
  @property({
    name: 'is_validated',
    type: 'boolean',
    description: 'whether the lead`s email has been validated or not',
    required: true,
    default: false,
  })
  isValidated: boolean;

  @hasOne(() => Tenant, {keyTo: 'leadId'})
  tenant: Tenant;

  @belongsTo(() => Address, undefined, {
    name: 'address_id',
    description: 'id of the address of the lead',
  })
  addressId: string;

  constructor(data?: Partial<Lead>) {
    super(data);
  }
}

export interface LeadRelations {
  // describe navigational properties here
  address?: Address;
}

export type LeadWithRelations = Lead & LeadRelations;
