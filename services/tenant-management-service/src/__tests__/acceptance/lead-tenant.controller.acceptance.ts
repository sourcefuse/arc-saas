import {Client, sinon, expect} from '@loopback/testlab';
import {sign} from 'jsonwebtoken';
import {TenantMgmtServiceApplication} from '../..';
import {LeadRepository, TenantRepository} from '../../repositories';
import {
  mockAddress,
  mockDto,
  mockLeadDTO,
  mockSusbcription,
  mockTenant,
} from './mock-data';
import {getRepo, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';
import {BindingScope} from '@loopback/context';

describe('LeadTenantController', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;
  let leadsRepo: LeadRepository;
  let tenantRepo: TenantRepository;
  const basePath = '/leads/id/tenants';
  let findSubscriptionStub: sinon.SinonStub;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    leadsRepo = await getRepo<LeadRepository>(
      app,
      'repositories.LeadRepository',
    );
    tenantRepo = await getRepo<TenantRepository>(
      app,
      'repositories.TenantRepository',
    );
    findSubscriptionStub = sinon.stub();
    app
      .bind('services.SubscriptionProxyService')
      .to({
        findById: findSubscriptionStub,
      })
      .inScope(BindingScope.SINGLETON);
  });

  after(async () => {
    await app.stop();
  });
  beforeEach(async () => {
    findSubscriptionStub.resetHistory();
    findSubscriptionStub.resolves(mockSusbcription);
    await leadsRepo.deleteAllHard();
  });

  afterEach(async () => {
    await clearTenants();
  });

  it('should throw an error if token is not valid', async () => {
    const token = 'invalid-token';
    await client
      .post(basePath)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw an error if the lead does not exist', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    // delete the lead
    await leadsRepo.deleteByIdHard(lead.id);
    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${token}`)
      .send(mockDto)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw an error if token is not generated through leads API', async () => {
    const token = sign(
      {
        id: 'invalid-id',
        userTenantId: 'invalid-id',
        email: 'invalid-email',
      },
      process.env.JWT_SECRET!,
      {
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
      },
    );
    await client
      .post(basePath)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should accept the token created through leads api', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send(mockDto)
      .expect(STATUS_CODE.OK);
  });

  it('should create a valid tenant with a contact and address if the onboarding happens through a lead', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send(mockDto)
      .expect(STATUS_CODE.OK);

    const tenant = await tenantRepo.findOne({
      where: {
        leadId: lead.id,
      },
      include: ['contacts', 'address'],
    });

    expect(tenant).to.not.be.undefined();
    expect(tenant?.contacts).to.not.be.undefined();
    expect(tenant?.contacts).to.have.length(1);
    expect(tenant?.address).to.not.be.undefined();
    expect(tenant?.address?.address).to.eql(mockDto.address);
    expect(tenant?.address?.city).to.eql(mockDto.city);
    expect(tenant?.address?.state).to.eql(mockDto.state);
    expect(tenant?.address?.country).to.eql(mockDto.country);
  });

  it('should create a valid tenant with a contact and address(from lead) if the onboarding happens through a lead', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send({
        ...mockLeadDTO,
        address: {
          address: mockDto.address,
          city: mockDto.city,
          state: mockDto.state,
          country: mockDto.country,
          zip: mockDto.zip,
        },
      })
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send(mockDto)
      .expect(STATUS_CODE.OK);

    const tenant = await tenantRepo.findOne({
      where: {
        leadId: lead.id,
      },
      include: ['contacts', 'address'],
    });

    expect(tenant).to.not.be.undefined();
    expect(tenant?.contacts).to.not.be.undefined();
    expect(tenant?.contacts).to.have.length(1);
    expect(tenant?.address).to.not.be.undefined();
    expect(tenant?.address?.address).to.eql(mockDto.address);
    expect(tenant?.address?.city).to.eql(mockDto.city);
    expect(tenant?.address?.state).to.eql(mockDto.state);
    expect(tenant?.address?.country).to.eql(mockDto.country);
  });

  it('should throw an error if there is mismatch in lead and tenant creation address', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send({
        ...mockLeadDTO,
        address: mockAddress,
      })
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send(mockDto)
      .expect(STATUS_CODE.BAD_REQUEST);
  });

  it('should create a valid tenant with a contact if the onboarding happens through a lead, using leads details if missing for tenant', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send({
        key: mockDto.key,
        domains: mockDto.domains,
      })
      .expect(STATUS_CODE.OK);

    const tenant = await tenantRepo.findOne({
      where: {
        leadId: lead.id,
      },
      include: ['contacts'],
    });

    expect(tenant).to.not.be.undefined();
    expect(tenant?.contacts).to.not.be.undefined();
    expect(tenant?.contacts).to.have.length(1);
  });

  it('should throw error if the token created through leads api has already created a tenant', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    await seedTenant(lead.id);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    expect(token).is.not.undefined();
    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw error if the lead has not been verified before onboarding', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    // mark lead as invalid
    await leadsRepo.updateById(lead.id, {
      isValidated: false,
    });

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send(mockDto)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw error if the domain of lead does not match tenant domain', async () => {
    const {body: lead} = await client
      .post('/leads')
      .send(mockLeadDTO)
      .expect(STATUS_CODE.OK);
    // extract token from the link generated
    const token = lead.key;
    expect(token).is.not.undefined();
    expect(token).is.not.undefined();

    const {body} = await client
      .post(`/leads/${lead.id}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .expect(STATUS_CODE.OK);

    await client
      .post(createLeadPath(lead.id))
      .set('Authorization', `Bearer ${body.token}`)
      .send({...mockDto, domains: ['invalid-domain.com']})
      .expect(STATUS_CODE.BAD_REQUEST);
  });

  async function seedTenant(leadId: string) {
    await tenantRepo.create({...mockTenant, leadId});
  }

  async function clearTenants() {
    await tenantRepo.deleteAllHard();
  }

  function createLeadPath(leadId: string) {
    return basePath.replace('id', leadId);
  }
});
