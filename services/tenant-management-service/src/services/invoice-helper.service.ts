import pdfDocument from 'pdfkit';
import fs from 'fs';
import {Invoice} from '../models';
import {repository} from '@loopback/repository';
import {InvoiceRepository} from '../repositories';
import {BindingScope, injectable} from '@loopback/context';
const LARGE_SIZE = 16;
const MEDIUM_SIZE = 12;

@injectable({scope: BindingScope.TRANSIENT})
export class InvoiceHelperService {
  constructor(
    @repository(InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
  ) {}
  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    return this.invoiceRepository.create(invoice);
  }
  async downloadInvoice(id: string): Promise<void> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new Error('Invoice with given id does not exist');
    }

    const pdfFilePath = await this.generatePDF(invoice);
    invoice.invoiceFile = pdfFilePath;
    await this.invoiceRepository.updateById(invoice.id, invoice);
  }

  async generatePDF(invoice: Invoice): Promise<string> {
    const doc = new pdfDocument();
    const fileName = `invoice_${invoice.id}.pdf`;
    const writeStream = fs.createWriteStream(fileName);

    doc.pipe(writeStream);

    // Write invoice details to PDF
    doc
      .fontSize(LARGE_SIZE)
      .text('Invoice Details', {underline: true})
      .moveDown();
    doc.fontSize(MEDIUM_SIZE).text(`Invoice ID: ${invoice.id}`).moveDown();
    doc
      .fontSize(MEDIUM_SIZE)
      .text(`Start Date: ${invoice.startDate}`)
      .moveDown();
    doc.fontSize(MEDIUM_SIZE).text(`End Date: ${invoice.endDate}`).moveDown();
    doc
      .fontSize(MEDIUM_SIZE)
      .text(`Amount: ${invoice.amount} ${invoice.currencyCode}`)
      .moveDown();
    doc.fontSize(MEDIUM_SIZE).text(`Due Date: ${invoice.dueDate}`).moveDown();
    doc.fontSize(MEDIUM_SIZE).text(`Status: ${invoice.status}`).moveDown();

    // End PDF generation
    doc.end();

    return new Promise<string>((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(fileName);
      });
      writeStream.on('error', err => {
        reject(err);
      });
    });
  }
}
