import {VerifyFunction} from 'loopback4-authentication';
import {
  IPostWebhookHandlerService,
  ITenantManagementServiceConfig,
  LeadUser,
  ResourceProvisionedWebhookPayload,
  WebhookConfig,
  WebhookNotificationServiceType,
} from './types';
import {IAuthUser} from 'loopback4-authorization';
import {AnyObject} from '@loopback/repository';
import {WebhookController} from './controllers';
import {
  BindingKey,
  BindingTemplate,
  Interceptor,
  extensionFor,
} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {IEventConnector} from './types/i-event-connector.interface';

export namespace TenantManagementServiceBindings {
  export const Config =
    BindingKey.create<ITenantManagementServiceConfig | null>(
      `${BINDING_PREFIX}.chat.config`,
    );
}

/**
 * Binding key for the lead token verifier.
 */
export const LEAD_TOKEN_VERIFIER = BindingKey.create<
  VerifyFunction.BearerFn<LeadUser>
>('sf.user.lead.verifier');

/**
 * Binding key for the system user.
 */
export const SYSTEM_USER = BindingKey.create<IAuthUser & AnyObject>(
  'sf.user.system',
);

/**
 * Binding key for the webhook configuration.
 */
export const WEBHOOK_CONFIG =
  BindingKey.create<WebhookConfig>('sf.webhook.config');

/**
 * Binding key for the webhook verifier.
 */
export const WEBHOOK_VERIFIER = BindingKey.create<Interceptor>(
  'sf.webhook.verifier',
);

/**
 * Binding key for the webhook handler extension point.
 */
export const WebhookHandlerEP = BindingKey.create<WebhookController<never>>(
  `sf.webhook.handler.extensionpoint`,
);

/**
 * Binding template for the webhook handler.
 */
export const asWebhookHandler: BindingTemplate = binding => {
  extensionFor(WebhookHandlerEP.key)(binding);
  binding.tag({namespace: WebhookHandlerEP.key});
};

export const WebhookNotificationService =
  BindingKey.create<WebhookNotificationServiceType>(
    'sf.webhook.handler.notification.service',
  );

export const EventConnectorBinding = BindingKey.create<
  IEventConnector<unknown>
>('arc-saas.services.tenant-management.event-connector');

export const PostWebhookHandlerServiceKey = BindingKey.create<
  IPostWebhookHandlerService<ResourceProvisionedWebhookPayload>
>('services.PostWebhookHandlerService');
