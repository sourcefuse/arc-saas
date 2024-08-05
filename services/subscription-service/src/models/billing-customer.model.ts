import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
@model({
  name: 'billing_customer',
  description: 'contacts belonging to a tenant',
})
export class BillingCustomer extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'tenant_id',
    required: true,
  })
  tenantId: string; // tenantId of customer

  @property({
    type: 'string',
    name: 'customer_id',
    required: true,
  })
  customerId: string; // id of customer generated on third party billing module

  @property({
    type: 'string',
    name: 'payment_source_id',
  })
  paymentSourceId?: string;

  @property({
    type: 'string',
    name: 'invoice_id',
  })
  invoiceId?: string;

  @property({
    type: 'boolean',
    name: 'invoice_status',
    description: 'payment or invoice status',
  })
  invoiceStatus?: Boolean;

  constructor(data?: Partial<BillingCustomer>) {
    super(data);
  }
}
