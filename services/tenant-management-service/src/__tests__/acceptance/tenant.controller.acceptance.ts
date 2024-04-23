import {Client, expect, sinon} from '@loopback/testlab';
import {TenantMgmtServiceApplication} from '../..';
import {Tenant} from '../../models';
import {PermissionKey} from '../../permissions';
import {
  ContactRepository,
  LeadRepository,
  TenantRepository,
  WebhookSecretRepository,
} from '../../repositories';
import {
  mockLead,
  mockSusbcription,
  mockSubscriptionId,
  mockTenant,
  mockTenantOnboardDTO,
  testTemplates,
} from './mock-data';
import {getRepo, getToken, setupApplication} from './test-helper';
import {ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {BindingScope} from '@loopback/context';
import {AWS_CODEBUILD_CLIENT} from '../../services';
import {CodeBuildClient, StartBuildCommand} from '@aws-sdk/client-codebuild';
import {PlanTier} from '../../enums';
import {PIPELINES} from '../../keys';

describe('TenantController', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;
  const notifStub = sinon.stub().resolves();
  let savedTenant: Tenant;
  let tenantRepo: TenantRepository;
  let leadRepo: LeadRepository;
  let contactRepo: ContactRepository;
  let secretRepo: WebhookSecretRepository;
  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication(notifStub));
    app.bind('services.NotificationProxyService').to({
      createNotification: notifStub,
      getTemplateByName: (name: string) => testTemplates[name],
    });
    tenantRepo = await getRepo(app, 'repositories.TenantRepository');
    leadRepo = await getRepo(app, 'repositories.LeadRepository');
    contactRepo = await getRepo(app, 'repositories.ContactRepository');

    const logger = app.getSync<ILogger>(LOGGER.LOGGER_INJECT);
    app.bind(LOGGER.LOGGER_INJECT).to(logger).inScope(BindingScope.SINGLETON);
    app.bind(PIPELINES).to({
      [PlanTier.POOLED]: 'free-pipeline',
      [PlanTier.SILO]: '',
    });
    secretRepo = await getRepo(app, 'repositories.WebhookSecretRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
    notifStub.resolves();
    await secretRepo.deleteAll();
  });

  afterEach(async () => {
    notifStub.reset();
    notifStub.resetHistory();
    await tenantRepo.deleteAllHard();
    await leadRepo.deleteAllHard();
  });

  it('invokes POST /tenants with valid token', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    const {body} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send({...mockTenantOnboardDTO, name: 'test2'})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.name).to.eql('test2');

    // should create the contact as well
    const contact = await contactRepo.findOne({
      where: {email: mockTenantOnboardDTO.contact?.email},
    });
    expect(contact).to.not.be.null();
  });

  it('invokes POST /tenants/{id}/provision and successfully triggers a build', async () => {
    const token = getToken([
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
    ]);
    const {body: tenant} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send({...mockTenantOnboardDTO, name: 'test2'})
      .expect(STATUS_CODE.OK);

    await client
      .post(`/tenants/${tenant.id}/provision`)
      .set('Authorization', token)
      .send(mockSusbcription)
      .expect(STATUS_CODE.NO_CONTENT);

    const webhookSecret = await secretRepo.get(tenant.id);
    expect(webhookSecret).to.not.be.null();
    expect(webhookSecret.context).to.eql('test-id');
    expect(webhookSecret.secret).to.be.String();
  });

  it('invokes POST /tenants/{id}/provision but throws 400 for missing subscriptionId', async () => {
    const token = getToken([
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
    ]);
    const {body: tenant} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send(mockTenantOnboardDTO)
      .expect(STATUS_CODE.OK);

    await client
      .post(`/tenants/${tenant.id}/provision`)
      .set('Authorization', token)
      .send({subscriptionId: undefined})
      .expect(STATUS_CODE.BAD_REQUEST);
  });

  it('invokes POST /tenants/{id}/provision but throws 500 for missing plan details in a subscription', async () => {
    const invalidSubscription = {
      id: '1',
    };
    const token = getToken([
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
    ]);
    const {body: tenant} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send({...mockTenantOnboardDTO, name: 'test2'})
      .expect(STATUS_CODE.OK);

    await client
      .post(`/tenants/${tenant.id}/provision`)
      .set('Authorization', token)
      .send(invalidSubscription)
      .expect(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it('invokes POST /tenants/{id}/provision but throws 500 for missing plan tier in a subscription', async () => {
    const invalidSubscription = {
      id: mockSubscriptionId,
      plan: {
        metaData: {},
      },
    };
    const token = getToken([
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
    ]);
    const {body: tenant} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send(mockTenantOnboardDTO)
      .expect(STATUS_CODE.OK);

    await client
      .post(`/tenants/${tenant.id}/provision`)
      .set('Authorization', token)
      .send(invalidSubscription)
      .expect(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it('invokes POST /tenants/{id}/provision but throws 500 for missing plan pipeline in a subscription', async () => {
    const invalidSubscription = {
      id: mockSubscriptionId,
      plan: {
        tier: PlanTier.SILO,
      },
    };
    const token = getToken([
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
    ]);
    const {body: tenant} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send(mockTenantOnboardDTO)
      .expect(STATUS_CODE.OK);

    await client
      .post(`/tenants/${tenant.id}/provision`)
      .set('Authorization', token)
      .send(invalidSubscription)
      .expect(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it('invokes POST /tenants/{id}/provision but throws 500 for missing build id', async () => {
    app.bind(AWS_CODEBUILD_CLIENT).to({
      send: (cmd: StartBuildCommand) => {
        return {
          build: {},
        };
      },
    } as unknown as CodeBuildClient);
    const token = getToken([
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
    ]);
    const {body: tenant} = await client
      .post('/tenants')
      .set('Authorization', token)
      .send({...mockTenantOnboardDTO, name: 'test2'})
      .expect(STATUS_CODE.OK);

    await client
      .post(`/tenants/${tenant.id}/provision`)
      .set('Authorization', token)
      .send(mockSusbcription)
      .expect(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it('invokes GET /tenants with valid token', async () => {
    const token = getToken([PermissionKey.ViewTenant]);
    const {body} = await client
      .get('/tenants')
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].name).to.eql(mockTenant.name);
  });

  it('should not allow GET /tenants with invalid token', async () => {
    const token = getToken([PermissionKey.ViewLead]);
    await client
      .get('/tenants')
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /tenants/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewTenant]);
    const {body} = await client
      .get(`/tenants/${savedTenant.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.name).to.eql(mockTenant.name);
  });

  it('invokes GET /tenants/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewTenant]);
    const {body} = await client
      .get(`/tenants/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /tenants/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateTenant]);

    await client
      .put(`/tenants/${savedTenant.id}`)
      .set('Authorization', token)
      .send({...savedTenant, name: updatedName, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await tenantRepo.findById(savedTenant.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /tenants/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateTenant]);

    await client
      .patch(`/tenants/${savedTenant.id}`)
      .set('Authorization', token)
      .send({name: updatedName})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await tenantRepo.findById(savedTenant.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /tenants with valid token', async () => {
    const token = getToken([PermissionKey.UpdateTenant]);

    const {body} = await client
      .patch(`/tenants`)
      .set('Authorization', token)
      .send({name: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await tenantRepo.findById(savedTenant.id);
    expect(updated?.name).to.eql('updated-test-all');
  });

  it('invokes DELETE /tenants/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeleteTenant]);

    await client
      .delete(`/tenants/${savedTenant.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await tenantRepo.findById(savedTenant.id);
      throw new Error('Tenant not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    const lead = await leadRepo.create(mockLead);
    savedTenant = await tenantRepo.create({...mockTenant, leadId: lead.id});
  }
});
