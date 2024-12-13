import {AnyObject, model, Model, property} from '@loopback/repository';

@model({
  name: 'payment_source_dto',
})
export class PaymentSourceDto extends Model {
  @property({
    type: 'string',
    name: 'id',
  })
  id?: string;

  @property({
    type: 'string',
    name: 'customer_id',
  })
  customerId: string;

  @property({
    type: 'object',
    name: 'card',
    jsonSchema: {
      type: 'object',
      properties: {
        gatewayAccountId: {type: 'string'},
        number: {type: 'string'},
        expiryMonth: {type: 'number'},
        expiryear: {type: 'number'},
        cvv: {type: 'string'},
      },
      required: [
        'gatewayAccountId',
        'number',
        'expiryMonth',
        'expiryYear',
        'cvv',
      ],
    },
  })
  card?: ICard;

  @property({
    type: 'object',
  })
  options?: AnyObject;
  constructor(data?: Partial<PaymentSourceDto>) {
    super(data);
  }
}

// this refers to the card
export interface ICard {
  gatewayAccountId: string;
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}
