import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {InvoiceStatus} from '../types';
@model({
  name: 'invoice',
  description: 'invoice for a customer',
})
export class Invoice extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'invoice_id',
    required: true,
  })
  invoiceId: string;

  @property({
    type: 'string',
    name: 'invoice_status',
    description: 'payment or invoice status',
  })
  invoiceStatus?: InvoiceStatus;

  @property({
    type: 'string',
    name: 'billing_customer_id',
    required: true,
  })
  billingCustomerId: string;

  constructor(data?: Partial<Invoice>) {
    super(data);
  }
}
