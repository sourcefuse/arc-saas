import {WebhookType} from '../enums/webhook-types.enum';
import {WebhookPayload} from './webhook-payload.type';

export interface IWebhookHandler {
  type: WebhookType;
  handle(payload: WebhookPayload): Promise<void>;
}

export type BaseUser = {
  id: string;
};

export type LeadUser = {
  userTenantId: string;
  email: string;
} & BaseUser;

export type LeadUserWithToken = {
  token: string;
} & LeadUser;

export type WebhookRequest = {
  initiaterId: string;
};

export type WebhookConfig = {
  timestampHeaderName: string;
  signatureHeaderName: string;
  timestampTolerance: number;
};

export const TenantManagementDbSourceName = 'TenantManagementDB';

export const TenantManagementCacheSourceName = 'TenantManagementCacheDB';

export * from './webhook-payload.type';
export * from './resource.type';
export * from './i-provisioning-service.interface';
export * from './i-subscription.interface';
