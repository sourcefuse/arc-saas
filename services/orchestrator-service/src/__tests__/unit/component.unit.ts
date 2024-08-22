import {expect} from '@loopback/testlab';
import {EventController} from './../../controllers';
import {RestApplication} from '@loopback/rest';
import {
  OrchestratorServiceBindings,
  TierDetailsProvider,
  TenantProvisioningHandlerProvider,
  TenantDeprovisioningHandlerProvider,
  TenantProvisioningSuccessHandlerProvider,
  TenantProvisioningFailureHandlerProvider,
  OrchestratorService,
  BuilderService,
  TierDetailsFn,
  TenantDeploymentHandlerProvider,
} from './../../';
import {OrchestratorServiceComponent} from '../../component';
import {Provider} from '@loopback/context';

describe('OrchestratorServiceComponent', () => {
  let app: RestApplication;
  let component: OrchestratorServiceComponent;

  beforeEach(givenApplication);

  it('binds all providers when not already bound', () => {
    const expectedProviders = [
      OrchestratorServiceBindings.TIER_DETAILS_PROVIDER,
      OrchestratorServiceBindings.TENANT_PROVISIONING_HANDLER,
      OrchestratorServiceBindings.TENANT_DEPROVISIONING_HANDLER,
      OrchestratorServiceBindings.TENANT_PROVISIONING_SUCCESS_HANDLER,
      OrchestratorServiceBindings.TENANT_PROVISIONING_FAILURE_HANDLER,
    ];

    expectedProviders.forEach(binding => {
      expect(app.isBound(binding.key)).to.be.true();
    });
  });

  it('binds all services when not already bound', () => {
    const expectedServices = [
      OrchestratorServiceBindings.ORCHESTRATOR_SERVICE,
      OrchestratorServiceBindings.BUILDER_SERVICE,
    ];

    expectedServices.forEach(binding => {
      expect(app.isBound(binding.key)).to.be.true();
    });
  });

  it('registers EventController', () => {
    expect(component.controllers).to.containEql(EventController);
  });

  it('respects existing bindings', async () => {
    class MockTierDetailsProvider implements Provider<TierDetailsFn> {
      constructor() {}
      value() {
        return (tier: string) => {
          return {foo: `bar`};
        };
      }
    }

    app
      .bind(OrchestratorServiceBindings.TIER_DETAILS_PROVIDER)
      .toProvider(MockTierDetailsProvider);

    // Re-initialize the component
    component = new OrchestratorServiceComponent(app);

    const boundProvider = await app.get<TierDetailsFn>(
      OrchestratorServiceBindings.TIER_DETAILS_PROVIDER.key,
    );
    expect(boundProvider('sample-tier')).to.have.property('foo');
  });

  it('binds providers to the correct classes', async () => {
    const providerMap = {
      [OrchestratorServiceBindings.TIER_DETAILS_PROVIDER.key]:
        TierDetailsProvider,
      [OrchestratorServiceBindings.TENANT_PROVISIONING_HANDLER.key]:
        TenantProvisioningHandlerProvider,
      [OrchestratorServiceBindings.TENANT_DEPROVISIONING_HANDLER.key]:
        TenantDeprovisioningHandlerProvider,
      [OrchestratorServiceBindings.TENANT_PROVISIONING_SUCCESS_HANDLER.key]:
        TenantProvisioningSuccessHandlerProvider,
      [OrchestratorServiceBindings.TENANT_PROVISIONING_FAILURE_HANDLER.key]:
        TenantProvisioningFailureHandlerProvider,
      [OrchestratorServiceBindings.TENANT_DEPLOYMENT_HANDLER.key]:
        TenantDeploymentHandlerProvider,
    };

    for (const [key] of Object.entries(providerMap)) {
      expect(app.isBound(key)).to.be.true();
      const boundValue = app.getBinding(key);
      expect(boundValue.tagMap.type).to.be.eql('provider');
    }
  });

  it('binds services to the correct classes', async () => {
    const serviceMap = {
      [OrchestratorServiceBindings.ORCHESTRATOR_SERVICE.key]:
        OrchestratorService,
      [OrchestratorServiceBindings.BUILDER_SERVICE.key]: BuilderService,
    };

    for (const [key, expectedClass] of Object.entries(serviceMap)) {
      const boundService = await app.getSync(key);
      expect(boundService).to.be.instanceOf(expectedClass);
    }
  });

  function givenApplication() {
    app = new RestApplication();
    component = new OrchestratorServiceComponent(app);
    app.component(OrchestratorServiceComponent);
  }
});
