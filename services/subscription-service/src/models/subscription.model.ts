import {model, property, belongsTo} from '@loopback/repository';
import {SubscriptionStatus} from '../enums/subscription-status.enum';
import {numericEnumValues} from '../utils';
import {UserModifiableEntity} from '@sourceloop/core';
import {Plan} from './plan.model';
import {Invoice} from './invoice.model';

@model({
  name: 'subscriptions',
})
export class Subscription extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    name: 'subscriber_id',
  })
  subscriberId: string;

  @property({
    type: 'string',
    required: true,
    name: 'start_date',
  })
  startDate: string;

  @property({
    type: 'string',
    required: true,
    name: 'end_date',
  })
  endDate: string;

  @property({
    type: 'number',
    required: true,
    description:
      'status of the subscription, it can be - 0(pending), 1(active), 2(inactive), 3(cancelled) and 4(expired)',
    jsonSchema: {
      enum: numericEnumValues(SubscriptionStatus),
    },
  })
  status: SubscriptionStatus;

  @belongsTo(() => Plan, undefined, {
    description: 'plan id of the subscription',
    name: 'plan_id',
  })
  planId: string;

  @belongsTo(() => Invoice, undefined, {
    description: 'invoice id of the subscription',
    name: 'invoice_id',
  })
  invoiceId: string;

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}

export interface SubscriptionRelations {
  plan: Plan;
}

export type SubscriptionWithRelations = Subscription & SubscriptionRelations;
