import {expect, sinon} from '@loopback/testlab';
import {
  OrchestratorService,
  DefaultEventTypes,
  TenantProvisioningHandler,
  TenantDeprovisioningHandler,
  TenantProvisioningSuccessHandler,
  TenantProvisioningFailureHandler,
} from '../..';

describe('OrchestratorService', () => {
  let orchestratorService: OrchestratorService;
  let tenantProvisioningHandlerStub: sinon.SinonStub;
  let tenantDeprovisioningHandlerStub: sinon.SinonStub;
  let tenantProvisioningSuccessHandlerStub: sinon.SinonStub;
  let tenantProvisioningFailureHandlerStub: sinon.SinonStub;

  beforeEach(givenOrchestratorService);

  it('handles TENANT_PROVISIONING event', async () => {
    const eventBody = {tenantId: '123'};
    await orchestratorService.handleEvent(
      DefaultEventTypes.TENANT_PROVISIONING,
      eventBody,
    );
    expect(
      tenantProvisioningHandlerStub.calledOnceWith(eventBody),
    ).to.be.true();
  });

  it('handles TENANT_DEPROVISIONING event', async () => {
    const eventBody = {tenantId: '123'};
    await orchestratorService.handleEvent(
      DefaultEventTypes.TENANT_DEPROVISIONING,
      eventBody,
    );
    expect(
      tenantDeprovisioningHandlerStub.calledOnceWith(eventBody),
    ).to.be.true();
  });

  it('handles TENANT_PROVISIONING_SUCCESS event', async () => {
    const eventBody = {tenantId: '123'};
    await orchestratorService.handleEvent(
      DefaultEventTypes.TENANT_PROVISIONING_SUCCESS,
      eventBody,
    );
    expect(
      tenantProvisioningSuccessHandlerStub.calledOnceWith(eventBody),
    ).to.be.true();
  });

  it('handles TENANT_PROVISIONING_FAILED event', async () => {
    const eventBody = {tenantId: '123', error: 'Some error'};
    await orchestratorService.handleEvent(
      DefaultEventTypes.TENANT_PROVISIONING_FAILED,
      eventBody,
    );
    expect(
      tenantProvisioningFailureHandlerStub.calledOnceWith(eventBody),
    ).to.be.true();
  });

  it('throws error for unsupported event type', async () => {
    const eventBody = {};
    await expect(
      orchestratorService.handleEvent(
        'UNSUPPORTED_EVENT' as DefaultEventTypes,
        eventBody,
      ),
    ).to.be.rejectedWith('Unsupported event type: UNSUPPORTED_EVENT');
  });

  function givenOrchestratorService() {
    tenantProvisioningHandlerStub = sinon.stub();
    tenantDeprovisioningHandlerStub = sinon.stub();
    tenantProvisioningSuccessHandlerStub = sinon.stub();
    tenantProvisioningFailureHandlerStub = sinon.stub();

    orchestratorService = new OrchestratorService(
      tenantProvisioningHandlerStub as unknown as TenantProvisioningHandler,
      tenantDeprovisioningHandlerStub as unknown as TenantDeprovisioningHandler,
      tenantProvisioningSuccessHandlerStub as unknown as TenantProvisioningSuccessHandler,
      tenantProvisioningFailureHandlerStub as unknown as TenantProvisioningFailureHandler,
    );
  }
});
