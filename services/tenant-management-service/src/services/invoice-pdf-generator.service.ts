import pdfDocument from 'pdfkit';
import fs from 'fs';
import {Invoice} from '../models';
const LARGE_SIZE = 16;
const MEDIUM_SIZE = 12;

export class InvoicePDFGenerator {
  constructor() {}

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
