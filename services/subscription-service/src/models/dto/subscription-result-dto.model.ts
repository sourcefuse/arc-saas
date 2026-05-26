import {model, Model, property} from '@loopback/repository';

@model({name: 'subscription_result_dto'})
export class SubscriptionResultDto extends Model {
  @property({type: 'string'})
  id: string;

  @property({type: 'string'})
  status: string;

  @property({type: 'string'})
  customerId: string;

  @property({type: 'number'})
  currentPeriodStart?: number;

  @property({type: 'number'})
  currentPeriodEnd?: number;

  @property({type: 'boolean'})
  cancelAtPeriodEnd?: boolean;

  constructor(data?: Partial<SubscriptionResultDto>) {
    super(data);
  }
}
