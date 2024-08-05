// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
  ServiceOrProviderClass,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {SubscriptionServiceBindings} from './keys';
import {ISubscriptionServiceConfig} from './types';
import {
  BillingCycleRepository,
  CurrencyRepository,
  PlanItemRepository,
  PlanRepository,
  ResourceRepository,
  ServiceRepository,
  SubscriptionRepository,
} from './repositories';
import {
  BillinCycleController,
  CurrencyController,
  HomePageController,
  PingController,
  PlanController,
  PlanItemController,
  PlanSubscriptionController,
  ResourceController,
  ServiceController,
  SubscriptionController,
} from './controllers';
import {
  BillingCycle,
  Currency,
  PlanItem,
  Plan,
  Resource,
  Service,
  Subscription,
} from './models';
import {
  FeatureToggleBindings,
  FeatureToggleServiceComponent,
} from '@sourceloop/feature-toggle-service';

export class SubscriptionServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SubscriptionServiceBindings.Config, {optional: true})
    private readonly subscriptionConfig?: ISubscriptionServiceConfig,
  ) {
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    /**Bind the feature toggle service to main the list of features */
    this.application
      .bind(FeatureToggleBindings.Config)
      .to({bindControllers: true, useCustomSequence: true});
    this.application.component(FeatureToggleServiceComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Audit Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    if (!this.subscriptionConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

    this.repositories = [
      BillingCycleRepository,
      CurrencyRepository,
      PlanItemRepository,
      PlanRepository,
      ResourceRepository,
      ServiceRepository,
      SubscriptionRepository,
    ];

    this.models = [
      BillingCycle,
      Currency,
      PlanItem,
      Plan,
      Resource,
      Service,
      Subscription,
    ];

    this.controllers = [
      BillinCycleController,
      HomePageController,
      PingController,
      CurrencyController,
      PlanItemController,
      PlanController,
      ResourceController,
      ServiceController,
      SubscriptionController,
      PlanSubscriptionController,
    ];
  }

  providers?: ProviderMap = {};

  bindings?: Binding[] = [];

  services?: ServiceOrProviderClass[];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
