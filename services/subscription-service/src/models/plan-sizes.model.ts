import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'plan_sizes',
})
export class PlanSizes extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  size: string;

  @property({
    type: 'object',
  })
  config?: object;

  constructor(data?: Partial<PlanSizes>) {
    super(data);
  }
}

export interface PlanSizesRelations {}

export type PlanSizesWithRelations = PlanSizes;
