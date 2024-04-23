import {Client, expect} from '@loopback/testlab';
import {TenantMgmtServiceApplication} from '../..';
import {Invoice} from '../../models';
import {PermissionKey} from '../../permissions';
import {
  InvoiceRepository,
  LeadRepository,
  TenantRepository,
} from '../../repositories';
import {mockInvoice, mockLead, mockTenant} from './mock-data';
import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

describe('InvoiceController', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;

  let savedInvoice: Invoice;
  let invoiceRepo: InvoiceRepository;
  let tenantRepo: TenantRepository;
  let leadRepo: LeadRepository;

  const updatedStartDate = '2024-01-02';
  const originalStartDate = '2024-01-03';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    invoiceRepo = await getRepo(app, 'repositories.InvoiceRepository');
    tenantRepo = await getRepo(app, 'repositories.TenantRepository');
    leadRepo = await getRepo(app, 'repositories.LeadRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await invoiceRepo.deleteAllHard();
    await tenantRepo.deleteAllHard();
    await leadRepo.deleteAllHard();
  });

  it('invokes POST /invoices with valid token', async () => {
    const token = getToken([PermissionKey.CreateInvoice]);
    const {body} = await client
      .post('/invoices')
      .set('Authorization', token)
      .send({...mockInvoice, startDate: originalStartDate})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.startDate).to.eql(originalStartDate);
  });

  it('invokes GET /invoices with valid token', async () => {
    const token = getToken([PermissionKey.ViewInvoice]);
    const {body} = await client
      .get('/invoices')
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].startDate).to.eql(mockInvoice.startDate);
  });

  it('should not allow GET /invoices with invalid token', async () => {
    const token = getToken([PermissionKey.ViewLead]);
    await client
      .get('/invoices')
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /invoices/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewInvoice]);
    const {body} = await client
      .get(`/invoices/${savedInvoice.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.startDate).to.eql(mockInvoice.startDate);
  });

  it('invokes GET /invoices/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewInvoice]);
    const {body} = await client
      .get(`/invoices/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /invoices/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateInvoice]);

    await client
      .put(`/invoices/${savedInvoice.id}`)
      .set('Authorization', token)
      .send({...savedInvoice, startDate: updatedStartDate, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await invoiceRepo.findById(savedInvoice.id);
    expect(updated.startDate).to.eql(updatedStartDate);
  });

  it('invokes PATCH /invoices/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateInvoice]);

    await client
      .patch(`/invoices/${savedInvoice.id}`)
      .set('Authorization', token)
      .send({startDate: updatedStartDate})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await invoiceRepo.findById(savedInvoice.id);
    expect(updated.startDate).to.eql(updatedStartDate);
  });

  it('invokes PATCH /invoices with valid token', async () => {
    const token = getToken([PermissionKey.UpdateInvoice]);

    const {body} = await client
      .patch(`/invoices`)
      .set('Authorization', token)
      .send({startDate: updatedStartDate})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await invoiceRepo.findById(savedInvoice.id);
    expect(updated.startDate).to.eql(updatedStartDate);
  });

  it('invokes DELETE /invoices/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeleteInvoice]);

    await client
      .delete(`/invoices/${savedInvoice.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await invoiceRepo.findById(savedInvoice.id);
      throw new Error('Invoice not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    const lead = await leadRepo.create(mockLead);
    const tenant = await tenantRepo.create({...mockTenant, leadId: lead.id});
    savedInvoice = await invoiceRepo.create({
      ...mockInvoice,
      tenantId: tenant.id,
    });
  }
});
