import {model, property, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {BillingCycle} from './billing-cycle.model';
import {Currency} from './currency.model';

@model({
  name: 'plans',
})
export class Plan extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    description: 'name of the plan',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    description: 'description of the plan',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
    description: 'Tier of the plan.',
  })
  tier: string;

  @property({
    type: 'string',
    description: 'Size of the plan.',
  })
  size?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'object',
    name: 'meta_data',
    description: 'Meta data of the plan',
  })
  metaData?: object;

  @belongsTo(
    () => BillingCycle,
    {
      keyTo: 'id',
    },
    {
      name: 'billing_cycle_id',
    },
  )
  billingCycleId: string;

  @belongsTo(() => Currency, undefined, {
    name: 'currency_id',
  })
  currencyId: string;

  constructor(data?: Partial<Plan>) {
    super(data);
  }
}

export interface PlanRelations {}

export type PlanWithRelations = Plan;
