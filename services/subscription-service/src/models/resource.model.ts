import {AnyObject, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'resources',
})
export class Resource extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    description: 'name of the resource',
  })
  name: string;

  @property({
    type: 'object',
    required: true,
    description: 'config of the resource',
  })
  config: AnyObject;

  constructor(data?: Partial<Resource>) {
    super(data);
  }
}

export interface ResourceRelations {
  // describe navigational properties here
}

export type ResourceWithRelations = Resource;
