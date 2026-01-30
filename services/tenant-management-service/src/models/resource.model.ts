import {belongsTo, model, property} from '@loopback/repository';
import {Tenant} from './tenant.model';
import {ResourceData, ResourceTypes} from '../types';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'resources',
  description: 'model for resources that are provisioned for a tenant',
})
export class Resource<
  T extends ResourceData['metadata'] = ResourceData['metadata'],
>
  extends UserModifiableEntity
  implements ResourceData
{
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    description:
      'identifier for the resource in the external system it was provisioned',
    name: 'external_identifier',
    type: 'string',
    required: true,
  })
  externalIdentifier: string;

  @property({
    description: 'type of the resource like storage, compute, etc',
    name: 'type',
    type: 'string',
    required: true,
  })
  type: ResourceTypes;

  @property({
    description:
      'any type specific metadata of the resource like connection info, size, etc',
    type: 'object',
    required: true,
  })
  metadata: T;

  @belongsTo(
    () => Tenant,
    {keyTo: 'id'},
    {
      description: 'id of the tenant for which this resource is provisioned',
      name: 'tenant_id',
    },
  )
  tenantId: string;

  constructor(data?: Partial<Resource<T>>) {
    super(data);
  }
}

export interface ResourceRelations {
  // describe navigational properties here
  tenant?: Tenant;
}

export type ResourceWithRelations<T extends ResourceData['metadata']> =
  Resource<T> & ResourceRelations;
