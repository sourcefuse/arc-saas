import pdfDocument from 'pdfkit';
import fs from 'fs';
import {Invoice} from '../models';

export class InvoicePDFGenerator {
  constructor() {}

  async generatePDF(invoice: Invoice): Promise<string> {
    const doc = new pdfDocument();
    const fileName = `invoice_${invoice.id}.pdf`;
    const writeStream = fs.createWriteStream(fileName);

    doc.pipe(writeStream);

    // Write invoice details to PDF
    doc.fontSize(16).text('Invoice Details', {underline: true}).moveDown();
    doc.fontSize(12).text(`Invoice ID: ${invoice.id}`).moveDown();
    doc.fontSize(12).text(`Start Date: ${invoice.startDate}`).moveDown();
    doc.fontSize(12).text(`End Date: ${invoice.endDate}`).moveDown();
    doc
      .fontSize(12)
      .text(`Amount: ${invoice.amount} ${invoice.currencyCode}`)
      .moveDown();
    doc.fontSize(12).text(`Due Date: ${invoice.dueDate}`).moveDown();
    doc.fontSize(12).text(`Status: ${invoice.status}`).moveDown();

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
