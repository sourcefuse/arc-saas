// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
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
  SYSTEM_USER,
  TenantManagementServiceBindings,
  WEBHOOK_CONFIG,
  WEBHOOK_VERIFIER,
} from './keys';
import {ITenantManagementServiceConfig} from './types';
import {
  TenantConfigController,
  TenantConfigTenantController,
  WebhookController,
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
  TenantConfig,
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
  TenantConfigRepository,
} from './repositories';
import {WebhookVerifierProvider} from './interceptors';
import {SystemUserProvider} from './providers';
import {CryptoHelperService, NotificationService} from './services';
import {
  DEFAULT_SIGNATURE_HEADER,
  DEFAULT_TIMESTAMP_HEADER,
  DEFAULT_TIMESTAMP_TOLERANCE,
} from './utils';
import {ProvisioningWebhookHandler} from './services/webhook';
import {KeycloakIdpProvider} from './providers/idp/idp-keycloak.provider';
import {IdpController} from './controllers/idp.controller';
import { Auth0IdpProvider } from './providers/idp';

export class WebhookTenantManagementServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(TenantManagementServiceBindings.Config, {optional: true})
    private readonly notifConfig?: ITenantManagementServiceConfig,
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

    if (!this.notifConfig?.useCustomSequence) {
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
      TenantConfigRepository,
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
      TenantConfig,
    ];

    this.controllers = [
      WebhookController,
      IdpController,
      TenantConfigController,
      TenantConfigTenantController,
    ];

    this.bindings = [
      Binding.bind(WEBHOOK_VERIFIER).toProvider(WebhookVerifierProvider),
      Binding.bind(TenantManagementServiceBindings.IDP_KEYCLOAK).toProvider(
        KeycloakIdpProvider,
      ),
      Binding.bind(TenantManagementServiceBindings.IDP_AUTH0).toProvider(
        Auth0IdpProvider,
      ),
      Binding.bind(SYSTEM_USER).toProvider(SystemUserProvider),
      Binding.bind(WEBHOOK_CONFIG).to({
        signatureHeaderName: DEFAULT_SIGNATURE_HEADER,
        timestampHeaderName: DEFAULT_TIMESTAMP_HEADER,
        timestampTolerance: DEFAULT_TIMESTAMP_TOLERANCE,
      }),
      Binding.bind('services.NotificationService').toClass(NotificationService),
      createServiceBinding(ProvisioningWebhookHandler),
      createServiceBinding(CryptoHelperService),
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
