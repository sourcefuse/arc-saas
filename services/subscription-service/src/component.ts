// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {inject, Binding} from '@loopback/context';
import {
  Component,
  CoreBindings,
  ProviderMap,
  ServiceOrProviderClass,
  ControllerClass,
} from '@loopback/core';
import {Class, Repository, Model} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
  BearerVerifierBindings,
  BearerVerifierType,
  BearerVerifierConfig,
  BearerVerifierComponent,
} from '@sourceloop/core';
import {
  FeatureToggleBindings,
  FeatureToggleServiceComponent,
} from '@sourceloop/feature-toggle-service';
import {BillingComponent} from 'loopback4-billing';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  BillinCycleController,
  HomePageController,
  PingController,
  CurrencyController,
  PlanController,
  ResourceController,
  ServiceController,
  SubscriptionController,
  PlanSubscriptionController,
  PlanSizesController,
  PlanFeaturesController,
} from './controllers';
import {SubscriptionServiceBindings} from './keys';
import {
  BillingCycle,
  Currency,
  Plan,
  Resource,
  BillingCustomer,
  Invoice,
  Service,
  Subscription,
  PlanSizes,
} from './models';
import { BillingCycleRepository as BillingCycleSequelizeRepository,
  CurrencyRepository as CurrencySequelizeRepository,
  PlanRepository as PlanSequelizeRepository,
  ResourceRepository as ResourceSequelizeRepository,
  ServiceRepository as ServiceSequelizeRepository,
  SubscriptionRepository as SubscriptionSequelizeRepository,
  PlanSizesRepository as PlanSizesSequelizeRepository,
  BillingCustomerRepository as BillingCustomerSequelizeRepository,
  InvoiceRepository as InvoiceSequelizeRepository
 } from './repositories/sequelize';
import {
  BillingCycleRepository,
  CurrencyRepository,
  PlanRepository,
  ResourceRepository,
  ServiceRepository,
  SubscriptionRepository,
  PlanSizesRepository,
  BillingCustomerRepository,
  InvoiceRepository,
} from './repositories';
import {SubscriptionServiceConfig} from './types';
import {WebhookVerifierProvider} from './interceptors/webhook-verifier.interceptor';
import {SystemUserProvider} from './providers';
import {BillingCustomerController} from './controllers/billing-customer.controller';
import {BillingInvoiceController} from './controllers/billing-invoice.controller';
import {BillingPaymentSourceController} from './controllers/billing-payment-source.controller';
import {WebhookController} from './controllers/webhook.controller';

export class SubscriptionServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SubscriptionServiceBindings.Config, {optional: true})
    private readonly subscriptionConfig?: SubscriptionServiceConfig,
  ) {
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    /**Bind the feature toggle service to main the list of features */
    this.application
      .bind(FeatureToggleBindings.Config)
      .to({bindControllers: true, useCustomSequence: true});
    this.application.component(FeatureToggleServiceComponent);
    this.application.component(BillingComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Subscription Service',
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
    if(subscriptionConfig?.useSequelize){
      this.repositories=[
        BillingCustomerSequelizeRepository,
        BillingCycleSequelizeRepository,
        PlanSequelizeRepository,
        PlanSizesSequelizeRepository,
        InvoiceSequelizeRepository,
        ResourceSequelizeRepository,
        SubscriptionSequelizeRepository,
        ServiceSequelizeRepository,
        CurrencySequelizeRepository
      ]
    }
    else{
      this.repositories = [
        BillingCycleRepository,
        CurrencyRepository,
        PlanRepository,
        ResourceRepository,
        ServiceRepository,
        SubscriptionRepository,
        PlanSizesRepository,
        BillingCustomerRepository,
        InvoiceRepository,
      ];
    }

    this.models = [
      BillingCycle,
      Currency,
      Plan,
      Resource,
      BillingCustomer,
      Invoice,
      Service,
      Subscription,
      PlanSizes,
    ];
    this.bindings = [
      Binding.bind(SubscriptionServiceBindings.WEBHOOK_VERIFIER).toProvider(WebhookVerifierProvider),

      Binding.bind(SubscriptionServiceBindings.SYSTEM_USER).toProvider(SystemUserProvider),
    ];

    this.controllers = [
      BillinCycleController,
      HomePageController,
      PingController,
      CurrencyController,
      PlanController,
      ResourceController,
      ServiceController,
      SubscriptionController,
      PlanSubscriptionController,
      PlanSizesController,
      PlanFeaturesController,
      BillingCustomerController,
      BillingInvoiceController,
      BillingPaymentSourceController,
      WebhookController,
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
