import {model, Model, property} from '@loopback/repository';

@model({name: 'subscription_create_response_dto'})
export class SubscriptionCreateResponseDto extends Model {
  @property({type: 'string'})
  subscriptionId: string;

  constructor(data?: Partial<SubscriptionCreateResponseDto>) {
    super(data);
  }
}
