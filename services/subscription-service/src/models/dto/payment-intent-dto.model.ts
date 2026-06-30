import {model, Model, property} from '@loopback/repository';

@model({name: 'payment_intent_dto'})
export class PaymentIntentDto extends Model {
  @property({type: 'string'})
  id: string;

  @property({type: 'number'})
  amount: number;

  @property({type: 'string'})
  currency: string;

  @property({type: 'string'})
  status: string;

  @property({type: 'number'})
  created: number;

  @property({type: 'string', nullable: true})
  customer?: string;

  @property({type: 'object'})
  paymentMethod?: object;

  @property({type: 'string', nullable: true})
  description?: string;

  @property({type: 'object', additionalProperties: true})
  metadata?: object;

  constructor(data?: Partial<PaymentIntentDto>) {
    super(data);
  }
}
