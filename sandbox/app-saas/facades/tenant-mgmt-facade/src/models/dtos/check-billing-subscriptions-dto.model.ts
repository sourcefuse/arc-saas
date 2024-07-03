import {Model, model, property} from '@loopback/repository';

@model({
  description:
    'model describing payload used to check billing subscriptions for a tenant',
})
export class CheckBillingSubscriptionsDTO extends Model {
  @property({
    type: 'date',
    description: 'This is the date on which we want to check the billing',
  })
  options?: Date;

  constructor(data?: Partial<CheckBillingSubscriptionsDTO>) {
    super(data);
  }
}
