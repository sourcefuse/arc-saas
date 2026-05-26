import {model, Model, property} from '@loopback/repository';

@model({name: 'subscription_create_dto'})
export class SubscriptionCreateDto extends Model {
  @property({type: 'string'})
  customerId: string;

  @property({type: 'string'})
  priceRefId: string;

  @property({type: 'string'})
  collectionMethod: string;

  @property({type: 'number'})
  daysUntilDue?: number;

  constructor(data?: Partial<SubscriptionCreateDto>) {
    super(data);
  }
}
