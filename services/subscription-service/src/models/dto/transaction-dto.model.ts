import {Entity, model, property} from '@loopback/repository';
export enum PaymentMethodEnum {
  Cash = 'cash',
  Check = 'check',
  BankTranser = 'bank_transfer',
  Other = 'other',
  Custom = 'custom',
  PaymentSource = 'payment_source',
}

@model()
export class TransactionDto extends Entity {
  @property({
    type: 'number',
    required: false,
    jsonSchema: {
      minimum: 0,
    },
  })
  amount?: number;

  @property({
    type: 'string',
    description: 'payment method',
    required: true,
    jsonSchema: {
      enum: Object.values(PaymentMethodEnum),
    },
  })
  paymentMethod: PaymentMethodEnum;

  @property({
    type: 'string',
    required: false,
  })
  paymentSourceId?: string; // Optional

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 100,
    },
  })
  referenceNumber?: string; // Optional, max 100 chars

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 50,
    },
  })
  customPaymentMethodId?: string; // Optional, max 50 chars

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 100,
    },
  })
  idAtGateway?: string; // Optional, max 100 chars

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      enum: ['success', 'failure'],
    },
  })
  status?: 'success' | 'failure'; // Optional

  @property({
    type: 'number',
    required: false,
  })
  date?: number; // Optional, timestamp in seconds (UTC)

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 100,
    },
  })
  errorCode?: string; // Optional, max 100 chars

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 65000,
    },
  })
  errorText?: string; // Optional, max 65k chars

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      maxLength: 300,
    },
  })
  comment?: string; // Optional, max 300 chars

  constructor(data?: Partial<TransactionDto>) {
    super(data);
  }
}
