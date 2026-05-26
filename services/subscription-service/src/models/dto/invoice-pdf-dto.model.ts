import {model, Model, property} from '@loopback/repository';

@model({name: 'invoice_pdf_dto'})
export class InvoicePdfDto extends Model {
  @property({type: 'string'})
  invoiceId: string;

  @property({type: 'string'})
  pdfUrl: string;

  @property({type: 'string', format: 'date-time'})
  generatedAt: string;

  @property({type: 'string', format: 'date-time', nullable: true})
  expiresAt?: string | null;

  constructor(data?: Partial<InvoicePdfDto>) {
    super(data);
  }
}
