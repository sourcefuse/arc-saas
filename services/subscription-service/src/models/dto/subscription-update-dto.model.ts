import {model, Model, property} from '@loopback/repository';

@model({name: 'subscription_update_dto'})
export class SubscriptionUpdateDto extends Model {
  @property({type: 'string'})
  priceRefId?: string;

  @property({type: 'string'})
  prorationBehavior?: string;

  constructor(data?: Partial<SubscriptionUpdateDto>) {
    super(data);
  }
}
