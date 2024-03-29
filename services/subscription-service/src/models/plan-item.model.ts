import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Plan} from './plan.model';

@model({
  name: 'plan_items',
})
export class PlanItem extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    description: 'name of the plan item',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    name: 'plan_item_type',
    description: 'type of the plan item',
  })
  planItemType: string;

  @property({
    type: 'object',
    required: true,
    description: 'value of the plan item',
  })
  value: object;

  @belongsTo(() => Plan, undefined, {
    description: 'plan id of the plan item',
    name: 'plan_id',
  })
  planId: string;

  constructor(data?: Partial<PlanItem>) {
    super(data);
  }
}

export interface PlanItemRelations {
  plan: Plan;
}

export type PlanItemWithRelations = PlanItem & PlanItemRelations;
