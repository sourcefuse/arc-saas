import {model, Model, property} from '@loopback/repository';

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
  customer_id: string;

  @property({
    type: 'object',
    name: 'card',
    required: true,
    jsonSchema: {
      type: 'object',
      properties: {
        gateway_account_id: {type: 'string'},
        number: {type: 'string'},
        expiry_month: {type: 'number'},
        expiry_year: {type: 'number'},
        cvv: {type: 'number'},
      },
      required: [
        'gateway_account_id',
        'number',
        'expiry_month',
        'expiry_year',
        'cvv',
      ],
    },
  })
  card: ICard;

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
  cvv: number;
}
