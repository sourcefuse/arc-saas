import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Contact} from './contact.model';
import {Lead} from './lead.model';
import {Resource} from './resource.model';
import {Address} from './address.model';
import {TenantStatus} from '../enum';
import {numericEnumValues} from '../utils';

@model({
  name: 'tenants',
  description:
    'main model of the service that represents a tenant in the system, either pooled or siloed',
})
export class Tenant extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    description: 'name of the tenant',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    description:
      'status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)',
    required: true,
    jsonSchema: {
      enum: numericEnumValues(TenantStatus),
    },
  })
  status: TenantStatus;

  @property({
    type: 'string',
    description:
      'a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant',
    required: true,
    jsonSchema: {
      pattern: '^[a-z0-9]+$',
      maxLength: 10,
    },
  })
  key: string;

  @property({
    name: 'spoc_user_id',
    description:
      'user id of the admin user who acts as a spoc for this tenant.',
    type: 'string',
  })
  spocUserId?: string;

  @property({
    type: 'array',
    itemType: 'string',
    description: 'array of domains that are allowed for this tenant',
    postgresql: {
      dataType: 'varchar[]',
    },
    required: true,
  })
  domains: string[];

  @hasMany(() => Contact, {
    keyTo: 'tenantId',
  })
  contacts: Contact[];

  @hasMany(() => Resource, {
    keyTo: 'tenantId',
  })
  resources: Resource[];

  @belongsTo(() => Lead, undefined, {
    description:
      'id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.',
    name: 'lead_id',
  })
  leadId?: string;

  @belongsTo(() => Address, undefined, {
    name: 'address_id',
    description: 'id of the address of the tenant',
  })
  addressId: string;

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export interface TenantRelations {
  // describe navigational properties here
  lead?: Lead;
  contacts?: Contact[];
  resources?: Resource[];
  address?: Address;
}

export type TenantWithRelations = Tenant & TenantRelations;
