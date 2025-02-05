import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {Tenant} from './tenant.model';
import {InvoiceStatus} from '../enums';

@model({
  name: 'invoices',
  description:
    'this model represents an invoice with the amount and period generated for a tenant in the system',
})
export class Invoice extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    name: 'start_date',
    description: 'start date for the period this invoice is generated for',
  })
  startDate: string;

  @property({
    type: 'string',
    required: true,
    name: 'end_date',
    description: 'end date for the period this invoice is generated for',
  })
  endDate: string;

  @property({
    type: 'number',
    required: true,
    description: 'total amount for the invoice',
  })
  amount: number;

  @property({
    name: 'currency_code',
    type: 'string',
    required: true,
    description: 'currency for the invoice',
  })
  currencyCode: string;

  @property({
    name: 'invoice_file',
    type: 'string',
    description: 'option reference to the generated file of the invoice',
  })
  invoiceFile?: string;

  @property({
    name: 'due_date',
    type: 'string',
    required: true,
    description: 'due date for the invoice',
  })
  dueDate: string;

  @property({
    type: 'number',
    description: 'status of the invoice - 0(PENDING), 1(PAID), 2(CANCELLED)',
    required: true,
    default: InvoiceStatus.PENDING,
    jsonSchema: {
      enum: Object.values(InvoiceStatus),
    },
  })
  status: InvoiceStatus;

  @belongsTo(
    () => Tenant,
    {keyTo: 'id'},
    {
      type: 'string',
      name: 'tenant_id',
      description: 'id of the tenant this invoice is generated for',
      required: true,
    },
  )
  tenantId: string;

  constructor(data?: Partial<Invoice>) {
    super(data);
  }
}

export interface InvoiceRelations {
  tenant?: Tenant;
}

export type InvoiceWithRelations = Invoice & InvoiceRelations;
