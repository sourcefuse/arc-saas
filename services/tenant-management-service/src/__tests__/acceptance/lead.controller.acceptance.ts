import {Client, expect} from '@loopback/testlab';
import {TenantMgmtServiceApplication} from '../..';
import {Lead} from '../../models';
import {PermissionKey} from '../../permissions';
import {LeadRepository} from '../../repositories';
import {mockAddress, mockLead, mockLeadDTO, mockLeadId} from './mock-data';
import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

describe('LeadController', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;

  let savedLeads: Lead[] = [];
  let repo: LeadRepository;
  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    repo = await getRepo<LeadRepository>(app, 'repositories.LeadRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    savedLeads = await repo.createAll([mockLead]);
  });

  afterEach(async () => {
    await repo.deleteAllHard();
  });

  it('invokes POST /leads', async () => {
    await client.post('/leads').send(mockLeadDTO).expect(STATUS_CODE.OK);
  });

  it('invokes POST /leads and creates a lead with address', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send({...mockLeadDTO, address: mockAddress})
      .expect(STATUS_CODE.OK);

    const [leads] = await repo.find({
      include: ['address'],
      where: {
        id: lead.id,
      },
    });
    expect(leads).to.not.be.undefined();
    expect(leads.address?.address).to.eql(mockAddress.address);
    expect(leads.address?.city).to.eql(mockAddress.city);
    expect(leads.address?.state).to.eql(mockAddress.state);
    expect(leads.address?.country).to.eql(mockAddress.country);
    expect(leads.address?.zip).to.eql(mockAddress.zip);
  });

  it('throws 409 if a validated lead with same email already exists', async () => {
    await repo.create({
      ...mockLead,
      isValidated: true,
    });
    await client.post('/leads').send(mockLeadDTO).expect(STATUS_CODE.CONFLICT);
  });

  it('invokes GET /leads with valid token', async () => {
    const token = getToken([PermissionKey.ViewLead]);
    const {body} = await client
      .get('/leads')
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].firstName).to.eql(mockLead.firstName);
    expect(body[0].email).to.eql(mockLead.email);
  });

  it('invokes POST /leads/validate with valid token to validate a lead', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);

    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();

    await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    const validatedLead = await repo.findById(lead.id);
    expect(validatedLead?.isValidated).to.be.true();
  });

  it('should not allow GET /leads with invalid token', async () => {
    const token = getToken([PermissionKey.ViewContact]);
    await client
      .get('/leads')
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /leads/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewLead]);
    const {body} = await client
      .get(`/leads/${savedLeads[0].id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.firstName).to.eql(mockLead.firstName);
    expect(body.email).to.eql(mockLead.email);
  });

  it('invokes GET /leads/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewLead]);
    const {body} = await client
      .get(`/leads/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('should not allow PUT /leads/{id} even with valid token', async () => {
    const token = getToken([PermissionKey.UpdateLead]);

    await client
      .put(`/leads/${mockLeadId}`)
      .set('Authorization', token)
      .send({...mockLead, firstName: updatedName, isValidated: true})
      .expect(STATUS_CODE.METHOD_NOT_ALLOWED);
  });

  it('should not allow patch /leads/{id} even with valid token', async () => {
    const token = getToken([PermissionKey.UpdateLead]);

    await client
      .patch(`/leads/${mockLeadId}`)
      .set('Authorization', token)
      .send({...mockLead, firstName: updatedName})
      .expect(STATUS_CODE.METHOD_NOT_ALLOWED);
  });

  it('should not allow patch /leads even with valid token', async () => {
    const token = getToken([PermissionKey.UpdateLead]);

    await client
      .patch(`/leads`)
      .set('Authorization', token)

      .send({...mockLead, firstName: updatedName})
      .expect(STATUS_CODE.METHOD_NOT_ALLOWED);
  });

  it('should not allow delete /leads/{id} even with valid token', async () => {
    const token = getToken([PermissionKey.DeleteLead]);

    await client
      .delete(`/leads/${mockLeadId}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.METHOD_NOT_ALLOWED);
  });
});
