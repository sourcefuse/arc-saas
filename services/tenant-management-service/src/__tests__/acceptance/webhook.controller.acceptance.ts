import {BindingScope} from '@loopback/context';
import {Client, expect, sinon} from '@loopback/testlab';
import {ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {createHmac, randomBytes} from 'crypto';
import {TenantMgmtServiceApplication} from '../../application';
import {TenantStatus} from '../../enums';
import {PostWebhookHandlerServiceKey, WEBHOOK_CONFIG} from '../../keys';
import {
  ContactRepository,
  ResourceRepository,
  TenantRepository,
  WebhookSecretRepository,
} from '../../repositories';
import {ResourceData, WebhookConfig, WebhookPayload} from '../../types';
import {mockContact, mockWebhookPayload, testTemplates} from './mock-data';
import {getRepo, setupApplication} from './test-helper';

describe('WebhookController', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;
  let webhookConfig: WebhookConfig;
  let loggerSpy: sinon.SinonSpiedInstance<ILogger>;
  let resourceRepo: ResourceRepository;
  let tenantRepo: TenantRepository;
  let contactRepo: ContactRepository;
  let webhookPayload: WebhookPayload;
  let postWebhookHandlerServiceStub: sinon.SinonStub;
  const nonExistantTenant = 'non-existant-tenant';
  const notifStub = sinon.stub();

  before('setupApplication', async () => {
    ({app, client} = await setupApplication(notifStub));
    webhookConfig = app.getSync(WEBHOOK_CONFIG);
    const logger = app.getSync<ILogger>(LOGGER.LOGGER_INJECT);
    loggerSpy = sinon.spy(logger);
    app.bind(LOGGER.LOGGER_INJECT).to(logger).inScope(BindingScope.SINGLETON);
    resourceRepo = await getRepo<ResourceRepository<ResourceData['metadata']>>(
      app,
      'repositories.ResourceRepository',
    );
    tenantRepo = await getRepo<TenantRepository>(
      app,
      'repositories.TenantRepository',
    );
    contactRepo = await getRepo<ContactRepository>(
      app,
      'repositories.ContactRepository',
    );
    app.bind('services.NotificationProxyService').to({
      createNotification: notifStub,
      getTemplateByName: (name: string) => testTemplates[name],
    });

    postWebhookHandlerServiceStub = sinon.stub();
    app.bind(PostWebhookHandlerServiceKey).to({
      postWebhookHandler: postWebhookHandlerServiceStub,
    });
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    notifStub.reset();
    notifStub.resetHistory();
    loggerSpy.error.resetHistory();
    notifStub.resolves();
    await resourceRepo.deleteAllHard();
    await tenantRepo.deleteAllHard();
    const tenant = await seedTenant();
    webhookPayload = {
      ...mockWebhookPayload,
      initiatorId: tenant.id,
    };
  });

  describe('Common', () => {
    it('should call postWebhookHandler on successful webhook processing', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.NO_CONTENT);

      // Verify that postWebhookHandler is called
      sinon.assert.calledOnce(postWebhookHandlerServiceStub);
      sinon.assert.calledWith(postWebhookHandlerServiceStub, webhookPayload);
    });
    it('should return 204 status for a webhook call with valid token', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.NO_CONTENT);
      expect(loggerSpy.error.calledOnce).to.be.false();
    });

    it('should return 401 status for a webhook call with an invalid token', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(
          webhookConfig.signatureHeaderName,
          headers.signature.slice(0, headers.signature.length - 4) + 'abcd',
        )
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.UNAUTHORISED);
      sinon.assert.calledWith(loggerSpy.error, 'Invalid signature');
    });

    it('should return 401 status for a webhook call with an expired timestamp', async () => {
      const sixSeconds = 6000;
      // generate token that was set 6 seconds ago
      const headers = await buildHeaders(
        webhookPayload,
        Date.now() - sixSeconds,
      );
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.UNAUTHORISED);
      sinon.assert.calledWith(loggerSpy.error, 'Timestamp out of tolerance');
    });

    it('should return 401 status for a webhook call with an invalid timestamp', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, 'what')
        .send(webhookPayload)
        .expect(STATUS_CODE.UNAUTHORISED);
      sinon.assert.calledWith(loggerSpy.error, 'Invalid timestamp');
    });

    it('should return 401 status for a webhook call with missing signature', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, '')
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.UNAUTHORISED);
      sinon.assert.calledWith(loggerSpy.error, 'Missing signature string');
    });

    it('should return 401 status for a webhook call with initiator with no secret in cache', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, '')
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send({...webhookPayload, initiatorId: nonExistantTenant})
        .expect(STATUS_CODE.UNAUTHORISED);
      sinon.assert.calledWith(loggerSpy.error, 'Missing signature string');
    });

    it('should return 422 status for a webhook call with invalid type', async () => {
      const headers = await buildHeaders({
        ...webhookPayload,
        type: 2,
      } as unknown as WebhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send({...webhookPayload, type: 2})
        .expect(STATUS_CODE.UNPROCESSED_ENTITY);
    });
  });

  describe('For Provisioning', () => {
    it('should successfully call the provisioning handler for a valid payload', async () => {
      const headers = await buildHeaders(webhookPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.NO_CONTENT);

      const tenant = await tenantRepo.findById(webhookPayload.initiatorId);
      expect(tenant.status).to.equal(TenantStatus.ACTIVE);

      // should send an email to primary contact as well for successful provisioning
      const calls = notifStub.getCalls();
      expect(calls).to.have.length(1);
      // extract and validate data from the email
      const emailData = calls[0].args[2];
      const receiver = calls[0].args[0];
      expect(emailData.link).to.be.String();
      expect(emailData.name).to.equal(tenant.name);
      expect(emailData.user).to.equal(mockContact.firstName);
      expect(receiver).to.equal(mockContact.email);

      // verify the resource was created
      const resources = await resourceRepo.find({
        where: {
          tenantId: webhookPayload.initiatorId,
        },
      });
      expect(resources).to.have.length(1);
      expect(resources[0].type).to.equal(webhookPayload.data.resources[0].type);
    });

    it('should successfully call the provisioning handler but skips mail for a valid payload but contact missing', async () => {
      const headers = await buildHeaders(webhookPayload);
      // delete contact to avoid sending email
      await contactRepo.deleteAllHard();

      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(webhookPayload)
        .expect(STATUS_CODE.NO_CONTENT);

      const tenant = await tenantRepo.findById(webhookPayload.initiatorId);
      expect(tenant.status).to.equal(TenantStatus.ACTIVE);

      // should throw an error if contact not found for the tenant
      const calls = notifStub.getCalls();
      expect(calls).to.have.length(0);
      // extract and validate data from the email
      sinon.assert.calledWith(
        loggerSpy.error,
        `No email found to notify tenant: ${tenant.id}`,
      );
    });

    it('should return 401 if the initiator id is for tenant that does not exist', async () => {
      const newPayload = {
        ...webhookPayload,
        initiatorId: nonExistantTenant,
      };
      const headers = await buildHeaders(newPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(newPayload)
        .expect(STATUS_CODE.UNAUTHORISED);

      const resources = await resourceRepo.find({
        where: {
          tenantId: newPayload.initiatorId,
        },
      });

      expect(resources).to.have.length(0);
      const tenant = await tenantRepo.findById(webhookPayload.initiatorId);
      expect(tenant.status).to.equal(TenantStatus.PROVISIONING);
    });

    it('should return 401 if the initiator id is for tenant that is not in provisioning state', async () => {
      await tenantRepo.updateById(webhookPayload.initiatorId, {
        status: TenantStatus.INACTIVE,
      });
      const newPayload = {
        ...webhookPayload,
        initiatorId: nonExistantTenant,
      };
      const headers = await buildHeaders(newPayload);
      await client
        .post('/webhook')
        .set(webhookConfig.signatureHeaderName, headers.signature)
        .set(webhookConfig.timestampHeaderName, headers.timestamp)
        .send(newPayload)
        .expect(STATUS_CODE.UNAUTHORISED);

      const resources = await resourceRepo.find({
        where: {
          tenantId: newPayload.initiatorId,
        },
      });

      expect(resources).to.have.length(0);
      const tenant = await tenantRepo.findById(webhookPayload.initiatorId);
      expect(tenant.status).to.equal(TenantStatus.INACTIVE);
    });
  });

  async function seedTenant() {
    const newTenant = await tenantRepo.create({
      name: 'test-tenant',
      status: TenantStatus.PROVISIONING,
      key: 'test-tenant-key',
      domains: ['test.com'],
    });
    await contactRepo.createAll([
      {
        ...mockContact,
        isPrimary: true,
        tenantId: newTenant.id,
      },
    ]);
    return newTenant;
  }

  async function buildHeaders(payload: WebhookPayload, tmp?: number) {
    const timestamp = String(tmp ?? Date.now());
    const secret = randomBytes(16).toString('hex');
    const context = payload.initiatorId;
    const signature = createHmac('sha256', secret)
      .update(`${JSON.stringify(payload)}${context}${timestamp}`)
      .digest('hex');
    const secretRepo = app.getSync<WebhookSecretRepository>(
      'repositories.WebhookSecretRepository',
    );
    await secretRepo.set(context, {
      secret,
      context: payload.initiatorId,
    });
    return {
      timestamp,
      signature,
    };
  }
});
