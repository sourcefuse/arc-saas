import {model, property} from '@loopback/repository';
import {PaymentMethodType} from '../types';

@model({
  name: 'billing_address_fields',
})
export class BillingAddressFields {
  @property({type: 'string'})
  line1?: string;

  @property({type: 'string'})
  city?: string;

  @property({type: 'string'})
  state?: string;

  @property({type: 'string'})
  zip?: string;

  @property({type: 'string'})
  country?: string;
}

@model({
  name: 'billing_customer_body',
})
export class BillingCustomerBody {
  @property({type: 'string', required: true})
  firstName!: string;

  @property({type: 'string', required: true})
  lastName!: string;

  @property({type: 'string', required: true})
  email!: string;

  @property({type: 'string'})
  company?: string;

  @property({type: 'string'})
  phone?: string;

  @property({type: BillingAddressFields})
  billingAddress?: BillingAddressFields;
}

@model({
  name: 'billing_payment_source_options',
})
export class BillingPaymentSourceOptions {
  @property({type: 'string'})
  token?: string;
}

@model({
  name: 'billing_payment_source_body',
})
export class BillingPaymentSourceBody {
  @property({type: 'string', required: true})
  customerId!: string;

  @property({type: BillingPaymentSourceOptions})
  options?: BillingPaymentSourceOptions;
}

@model({
  name: 'billing_payment_method_body',
})
export class BillingPaymentMethodBody {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: [
        'cash',
        'check',
        'bank_transfer',
        'other',
        'custom',
        'payment_source',
      ],
    },
  })
  paymentMethod!: PaymentMethodType;

  @property({type: 'string'})
  paymentSourceId?: string;

  @property({type: 'number'})
  amount?: number;

  @property({type: 'string'})
  referenceNumber?: string;

  @property({type: 'string'})
  comment?: string;
}

@model({
  name: 'billing_invoice_charge',
})
export class BillingInvoiceCharge {
  @property({type: 'number', required: true})
  amount!: number;

  @property({type: 'string', required: true})
  description!: string;
}

@model({
  name: 'billing_invoice_body',
})
export class BillingInvoiceBody {
  @property({type: 'string', required: true})
  customerId!: string;

  @property({type: 'string', required: true})
  currencyCode!: string;

  @property({
    type: 'array',
    itemType: BillingInvoiceCharge,
    required: true,
  })
  charges!: BillingInvoiceCharge[];

  @property({type: BillingAddressFields})
  shippingAddress?: BillingAddressFields;
}

@model({
  name: 'billing_shipping_address',
})
export class BillingShippingAddress {
  @property({type: 'string'})
  firstName?: string;

  @property({type: 'string'})
  lastName?: string;

  @property({type: 'string'})
  line1?: string;

  @property({type: 'string'})
  city?: string;

  @property({type: 'string'})
  state?: string;

  @property({type: 'string'})
  zip?: string;

  @property({type: 'string'})
  country?: string;
}

@model({
  name: 'billing_update_invoice_body',
})
export class BillingUpdateInvoiceBody {
  @property({type: 'string', required: true})
  customerId!: string;

  @property({type: 'string', required: true})
  currencyCode!: string;

  @property({type: BillingShippingAddress})
  shippingAddress?: BillingShippingAddress;
}

@model({
  name: 'billing_payment_status_response',
})
export class BillingPaymentStatusResponse {
  @property({type: 'boolean'})
  paid!: boolean;
}

@model({
  name: 'billing_error_response',
})
export class BillingErrorResponse {
  @property({type: 'object'})
  error: {
    statusCode: number;
    message: string;
  };
}
