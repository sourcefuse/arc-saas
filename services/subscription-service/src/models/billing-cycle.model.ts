import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'billing_cycles',
})
export class BillingCycle extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    name: 'cycle_name',
  })
  cycleName: string;

  @property({
    type: 'number',
    required: true,
  })
  duration: number;

  @property({
    type: 'string',
    required: true,
    name: 'duration_unit',
  })
  durationUnit: string;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<BillingCycle>) {
    super(data);
  }
}

export interface BillingCycleRelations {
  // describe navigational properties here
}

export type BillingCycleWithRelations = BillingCycle & BillingCycleRelations;
