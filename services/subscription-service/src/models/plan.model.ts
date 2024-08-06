import {model, property, hasMany, belongsTo} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {PlanItem} from './plan-item.model';
import {BillingCycle} from './billing-cycle.model';
import {Currency} from './currency.model';
import {numericEnumValues} from '../utils';
import {PlanTier} from '../enums';

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
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
    description: 'Tier of the plan, it can be - 0(Pooled) and  1(Silo)',
    jsonSchema: {
      enum: numericEnumValues(PlanTier),
    },
    default: PlanTier.POOLED,
  })
  tier: PlanTier;

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
  @hasMany(() => PlanItem, {keyTo: 'planId'})
  planItems: PlanItem;

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

export interface PlanRelations {
  planItems: PlanItem[];
  billingCycle: BillingCycle;
  currency: Currency;
}

export type PlanWithRelations = Plan & PlanRelations;
