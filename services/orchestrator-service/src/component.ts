import {
  Component,
  Constructor,
  ControllerClass,
  CoreBindings,
  createBindingFromClass,
  inject,
  Provider,
  ProviderMap,
  ServiceOrProviderClass,
} from '@loopback/core';
import {Binding} from '@loopback/context';
import {OrchestratorServiceBindings} from './services/types';
import {
  BuilderService,
  OrchestratorService,
  TenantProvisioningFailureHandlerProvider,
  TenantProvisioningHandlerProvider,
  TierDetailsProvider,
  TenantProvisioningSuccessHandlerProvider,
  TenantDeprovisioningHandlerProvider,
} from './services';
import {EventController} from './controllers';
import {RestApplication} from '@loopback/rest';
import {LoggingBindings, LoggingComponent} from '@loopback/logging';

export class OrchestratorServiceComponent implements Component {
  providers: ProviderMap = {};
  controllers: ControllerClass[] = [];
  bindings: Binding[] = [];
  services?: ServiceOrProviderClass[];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: RestApplication,
  ) {
    application.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false,
      enableHttpAccessLog: true,
    });
    application.component(LoggingComponent);

    // Bind Providers if not provided by consumer of the component
    this.bindProviders({
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
    });

    // Bind Service Classes if not provided by consumer of the component
    this.bindServiceClasses({
      [OrchestratorServiceBindings.ORCHESTRATOR_SERVICE.key]:
        OrchestratorService,
      [OrchestratorServiceBindings.BUILDER_SERVICE.key]: BuilderService,
    });

    this.controllers = [EventController];
  }

  private bindProviders(providersObject: ProviderMap) {
    for (const key in providersObject) {
      this.addProviderIfNotPresent(key, providersObject[key]);
    }
  }

  private bindServiceClasses(serviceObject: {
    [key: string]: Constructor<unknown>;
  }) {
    for (const key in serviceObject) {
      this.addClassBindingIfNotPresent(key, serviceObject[key]);
    }
  }

  private addClassBindingIfNotPresent<T>(key: string, cls: Constructor<T>) {
    if (!this.application.isBound(key)) {
      this.bindings.push(
        createBindingFromClass(cls, {
          key: key,
        }),
      );
    }
  }

  private addProviderIfNotPresent<T>(
    key: string,
    provider: Constructor<Provider<T>>,
  ) {
    if (!this.application.isBound(key)) {
      this.providers[key] = provider;
    }
  }
}
