import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Service} from './service.model';

@model({
  name: 'features',
})
export class Feature extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    description: 'name of the feature',
  })
  name: string;
  @property({
    type: 'object',
    description: ' properties of the feature',
  })
  properties: object;

  @belongsTo(() => Service, undefined, {
    description: 'service id of the feature',
    name: 'service_id',
  })
  serviceId: string;

  constructor(data?: Partial<Feature>) {
    super(data);
  }
}

export interface FeatureRelations {
  // describe navigational properties here
}

export type FeatureWithRelations = Feature & FeatureRelations;
