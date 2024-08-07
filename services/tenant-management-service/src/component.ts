// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  Constructor,
  ControllerClass,
  CoreBindings,
  createBindingFromClass,
  createServiceBinding,
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
import {
  EventConnectorBinding,
  LEAD_TOKEN_VERIFIER,
  SYSTEM_USER,
  TenantManagementServiceBindings,
} from './keys';
import {ITenantManagementServiceConfig} from './types';
import {InvoiceController} from './controllers/invoice.controller';
import {
  ContactController,
  HomePageController,
  LeadTenantController,
  LeadController,
  PingController,
  TenantController,
} from './controllers';
import {
  Address,
  Contact,
  Invoice,
  Lead,
  LeadToken,
  Resource,
  Tenant,
  WebhookSecret,
  CreateLeadDTO,
  ProvisioningDTO,
  TenantOnboardDTO,
  VerifyLeadResponseDTO,
  WebhookDTO,
} from './models';
import {
  AddressRepository,
  ContactRepository,
  InvoiceRepository,
  LeadTokenRepository,
  LeadRepository,
  ResourceRepository,
  TenantRepository,
  WebhookSecretRepository,
} from './repositories';
import {LeadTokenVerifierProvider, SystemUserProvider} from './providers';
import {
  CryptoHelperService,
  EventConnector,
  InvoicePDFGenerator,
  LeadAuthenticator,
  NotificationService,
  OnboardingService,
  ProvisioningService,
} from './services';
export class TenantManagementServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(TenantManagementServiceBindings.Config, {optional: true})
    private readonly tenantMgmtConfig?: ITenantManagementServiceConfig,
  ) {
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

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

    if (!this.tenantMgmtConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

    this.repositories = [
      AddressRepository,
      ContactRepository,
      InvoiceRepository,
      LeadTokenRepository,
      LeadRepository,
      ResourceRepository,
      TenantRepository,
      WebhookSecretRepository,
    ];

    this.models = [
      Address,
      Contact,
      Invoice,
      Lead,
      LeadToken,
      Resource,
      Tenant,
      WebhookSecret,
      CreateLeadDTO,
      ProvisioningDTO,
      TenantOnboardDTO,
      VerifyLeadResponseDTO,
      WebhookDTO,
    ];

    this.controllers = [
      ContactController,
      HomePageController,
      InvoiceController,
      LeadTenantController,
      LeadController,
      PingController,
      TenantController,
    ];

    this.bindings = [
      Binding.bind(LEAD_TOKEN_VERIFIER).toProvider(LeadTokenVerifierProvider),
      Binding.bind(SYSTEM_USER).toProvider(SystemUserProvider),
      createServiceBinding(ProvisioningService),
      createServiceBinding(OnboardingService),
      createServiceBinding(LeadAuthenticator),
      createServiceBinding(CryptoHelperService),
      Binding.bind('services.NotificationService').toClass(NotificationService),
      createServiceBinding(InvoicePDFGenerator),
    ];

    this.addClassBindingIfNotPresent(EventConnectorBinding.key, EventConnector);
  }

  providers?: ProviderMap = {};

  bindings: Binding[] = [];

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

  private addClassBindingIfNotPresent<T>(key: string, cls: Constructor<T>) {
    if (!this.application.isBound(key)) {
      this.bindings.push(
        createBindingFromClass(cls, {
          key: key,
        }),
      );
    }
  }
}
