import {Client, expect} from '@loopback/testlab';
import {TenantMgmtServiceApplication} from '../..';
import {Contact} from '../../models';
import {PermissionKey} from '../../permissions';
import {
  ContactRepository,
  LeadRepository,
  TenantRepository,
} from '../../repositories';
import {mockContact, mockLead, mockTenant} from './mock-data';
import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

describe('ContactController', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;

  let savedContact: Contact;
  let contactRepo: ContactRepository;
  let tenantRepo: TenantRepository;
  let leadRepo: LeadRepository;

  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    contactRepo = await getRepo(app, 'repositories.ContactRepository');
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
    await contactRepo.deleteAllHard();
    await tenantRepo.deleteAllHard();
    await leadRepo.deleteAllHard();
  });

  it('invokes POST /contacts with valid token', async () => {
    const token = getToken([PermissionKey.CreateContact]);
    const {body} = await client
      .post('/contacts')
      .set('Authorization', token)
      .send({...mockContact, firstName: 'test2'})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.firstName).to.eql('test2');
    expect(body.email).to.eql(mockContact.email);
  });

  it('invokes GET /contacts with valid token', async () => {
    const token = getToken([PermissionKey.ViewContact]);
    const {body} = await client
      .get('/contacts')
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].firstName).to.eql(mockContact.firstName);
    expect(body[0].email).to.eql(mockContact.email);
  });

  it('should not allow GET /contacts with invalid token', async () => {
    const token = getToken([PermissionKey.ViewLead]);
    await client
      .get('/contacts')
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /contacts/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewContact]);
    const {body} = await client
      .get(`/contacts/${savedContact.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.firstName).to.eql(mockContact.firstName);
    expect(body.email).to.eql(mockContact.email);
  });

  it('invokes GET /contacts/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewContact]);
    const {body} = await client
      .get(`/contacts/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /contacts/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateContact]);

    await client
      .put(`/contacts/${savedContact.id}`)
      .set('Authorization', token)
      .send({...savedContact, firstName: updatedName, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await contactRepo.findById(savedContact.id);
    expect(updated?.firstName).to.eql(updatedName);
  });

  it('invokes PATCH /contacts/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateContact]);

    await client
      .patch(`/contacts/${savedContact.id}`)
      .set('Authorization', token)
      .send({firstName: updatedName})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await contactRepo.findById(savedContact.id);
    expect(updated?.firstName).to.eql(updatedName);
  });

  it('invokes PATCH /contacts with valid token', async () => {
    const token = getToken([PermissionKey.UpdateContact]);

    const {body} = await client
      .patch(`/contacts`)
      .set('Authorization', token)
      .send({firstName: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await contactRepo.findById(savedContact.id);
    expect(updated?.firstName).to.eql('updated-test-all');
  });

  it('invokes DELETE /contacts/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeleteContact]);

    await client
      .delete(`/contacts/${savedContact.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await contactRepo.findById(savedContact.id);
      throw new Error('Contact not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    const lead = await leadRepo.create(mockLead);
    const tenant = await tenantRepo.create({...mockTenant, leadId: lead.id});
    savedContact = await contactRepo.create({
      ...mockContact,
      tenantId: tenant.id,
    });
  }
});
