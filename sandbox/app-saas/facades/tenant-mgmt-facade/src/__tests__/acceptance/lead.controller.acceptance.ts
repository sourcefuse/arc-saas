import {
  Client,
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
  sinon,
} from '@loopback/testlab';
import {TenantMgmtFacadeApplication} from '../../application';
import {TenantHelperService} from '../../services';
import {Tenant, VerifyLeadResponseDTO} from '../../models';
import {getToken, setupApplication} from './test-helper';
import {
  buildCreateLeadDto,
  buildCreateTenantDto,
  buildLead,
  buildTenant,
} from '../mock-data';
import {BindingScope, CoreTags} from '@loopback/core';
import {PermissionKey} from '../../permissions';
import {STATUS_CODE} from '@sourceloop/core';
import {TenantMgmtProxyService} from '../../services/proxies';
import {LeadTokenRepository} from '../../repositories';

describe('LeadController', () => {
  let app: TenantMgmtFacadeApplication;
  let tenantHelperStub: StubbedInstanceWithSinonAccessor<TenantHelperService>;
  let mockTenant: Tenant;
  let client: Client;
  const basePath = '/leads';
  const tenantsPath = `${basePath}/id/tenants`;
  let tenantMgmtProxyStub: sinon.SinonStubbedInstance<TenantMgmtProxyService>;
  let tokenRepo: LeadTokenRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    tokenRepo = await app.get<LeadTokenRepository>(
      'repositories.LeadTokenRepository',
    );
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    tenantHelperStub = createStubInstance(TenantHelperService);
    mockTenant = buildTenant();
    tenantHelperStub.stubs.createTenantFromLead.resolves(mockTenant);
    app
      .bind('services.TenantHelperService')
      .to(tenantHelperStub)
      .tag({
        [CoreTags.SERVICE_INTERFACE]: TenantHelperService,
      })
      .inScope(BindingScope.SINGLETON);
    tenantMgmtProxyStub = {
      createLead: sinon.stub(),
      createInvoice: sinon.stub(),
      createTenant: sinon.stub(),
      createTenantFromLead: sinon.stub(),
      provisionTenant: sinon.stub(),
      verifyLead: sinon.stub(),
      getLeads: sinon.stub(),
      getTenants: sinon.stub(),
    };
    app.bind('services.TenantMgmtProxyService').to(tenantMgmtProxyStub);
    await tokenRepo.deleteAll();
  });

  it('should create tenant for a a payload with a valid token', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    const {body: tenant} = await client
      .post(tenantsPath)
      .set('Authorization', token)
      .send(buildCreateTenantDto())
      .expect(STATUS_CODE.OK);
    expect(tenant.id).to.eql(mockTenant.id);
  });

  it('should create a lead for a a payload with a valid token', async () => {
    const lead = buildLead();
    tenantMgmtProxyStub.createLead.resolves({id: lead.id,key:'dummy key'});
    const token = getToken([PermissionKey.CreateLead]);
    const {body: createdLead} = await client
      .post(basePath)
      .set('Authorization', token)
      .send(buildCreateLeadDto())
      .expect(STATUS_CODE.OK);
    expect(lead.id).to.eql(createdLead.id);
  });

  it('should throw 422 if a lead instance is invalid while creating a lead', async () => {
    const lead = buildLead();
    tenantMgmtProxyStub.createLead.resolves({id: lead.id,key:'dummy key'});
    const token = getToken([PermissionKey.CreateLead]);
    await client
      .post(basePath)
      .set('Authorization', token)
      .send({...buildCreateLeadDto(), companyName: undefined})
      .expect(STATUS_CODE.UNPROCESSED_ENTITY);
  });

  it('should verify a lead with valid token', async () => {
    const lead = buildLead();
    const token = getToken([PermissionKey.CreateLead], true);
    const code = 'some-secret';
    await tokenRepo.set(code, {token: token});
    tenantMgmtProxyStub.verifyLead.resolves(
      new VerifyLeadResponseDTO({
        id: lead.id,
        token,
      }),
    );
    const {body} = await client
      .post(`${basePath}/${lead.id}/verify`)
      .set('Authorization', `Bearer ${code}`)
      .expect(STATUS_CODE.OK);
    expect(body.id).to.eql(lead.id);
    expect(body.token).to.eql(token);
  });

  it('should throw 401 if verifying a lead with invalid token', async () => {
    const lead = buildLead();
    const token = getToken([PermissionKey.CreateLead], true);
    const code = 'some-secret';
    tenantMgmtProxyStub.verifyLead.resolves(
      new VerifyLeadResponseDTO({
        id: lead.id,
        token,
      }),
    );
    await client
      .post(`${basePath}/${lead.id}/verify`)
      .set('Authorization', `Bearer ${code}`)
      .expect(STATUS_CODE.UNAUTHORISED);
  });

  it('should throw 403 if token is invalid', async () => {
    const token = getToken([PermissionKey.ViewTenant]);
    await client
      .post(tenantsPath)
      .set('Authorization', token)
      .send(buildCreateTenantDto())
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('should throw 422 if domain is of invalid format', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    await client
      .post(tenantsPath)
      .set('Authorization', token)
      .send({
        ...buildCreateTenantDto(),
        domain: ['some-domain'],
      })
      .expect(STATUS_CODE.UNPROCESSED_ENTITY);
  });

  it('should throw 422 if key is of invalid format', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    await client
      .post(tenantsPath)
      .set('Authorization', token)
      .send({
        ...buildCreateTenantDto(),
        key: 'some-key-with-hyphen',
      })
      .expect(STATUS_CODE.UNPROCESSED_ENTITY);
  });
});
