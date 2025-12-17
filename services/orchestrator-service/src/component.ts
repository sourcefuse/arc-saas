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
import {BuilderService, TierDetailsProvider} from './services';
import {RestApplication} from '@loopback/rest';
import {CoreComponent} from '@sourceloop/core';
import {EventStreamConnectorComponent} from 'loopback4-message-bus-connector';

export class OrchestratorServiceComponent implements Component {
  providers: ProviderMap = {};
  controllers: ControllerClass[] = [];
  bindings: Binding[] = [];
  services?: ServiceOrProviderClass[];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: RestApplication,
  ) {
    application.component(CoreComponent);
    application.component(EventStreamConnectorComponent);

    // Bind Providers if not provided by consumer of the component
    this.bindProviders({
      [OrchestratorServiceBindings.TIER_DETAILS_PROVIDER.key]:
        TierDetailsProvider,
    });

    // Bind Service Classes if not provided by consumer of the component
    this.bindServiceClasses({
      [OrchestratorServiceBindings.BUILDER_SERVICE.key]: BuilderService,
    });
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
