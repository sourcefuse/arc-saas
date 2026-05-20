// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IServiceConfig} from '@sourceloop/core';
import {TInvoice} from 'loopback4-billing';
export {FeatureToggleDbName} from '@sourceloop/feature-toggle-service';

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

export const SubscriptionDbSourceName = 'SubscriptionDB';
// sonarignore:end

export type InvoiceStatus =
  | 'paid'
  | 'posted'
  | 'payment_due'
  | 'not_paid'
  | 'voided'
  | 'pending';

export type PaymentMethodType =
  | 'cash'
  | 'check'
  | 'bank_transfer'
  | 'other'
  | 'custom'
  | 'payment_source';

export interface IPayload {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  event_type: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  webhook_status: string;
  content: IContent;
}

export interface IContent {
  invoice: TInvoice;
}
export interface ISubscriptionServiceConfig extends IServiceConfig {
  useCustomSequence: boolean;
  useSequelize?: boolean;
}

/**
 * Type alias for flexible webhook additional data.
 * Reduces union type complexity by grouping related types.
 */
type PrimitiveValue = string | number | boolean;
type OptionalValue = object | null | undefined;
type WebhookAdditionalData = PrimitiveValue | OptionalValue;

/**
 * Webhook payload structure from billing providers (Chargebee/Stripe).
 */
export interface IWebhookPayload {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  event_type: string;
  content: IWebhookContent;
  [key: string]: WebhookAdditionalData;
}

/**
 * Webhook content structure containing subscription, invoice, and transaction data.
 */
export interface IWebhookContent {
  subscription?: IWebhookSubscription;
  invoice?: IWebhookInvoice;
  transaction?: IWebhookTransaction;
  [key: string]: WebhookAdditionalData;
}

/**
 * Subscription data from webhook payload.
 */
export interface IWebhookSubscription {
  id: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  customer_id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  current_term_start?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  current_term_end?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cancel_at_period_end?: boolean;
  [key: string]: WebhookAdditionalData;
}

/**
 * Invoice data from webhook payload.
 */
export interface IWebhookInvoice {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  currency_code?: string;
  total?: number;
  [key: string]: WebhookAdditionalData;
}

/**
 * Transaction data from webhook payload.
 */
export interface IWebhookTransaction {
  amount?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_text?: string;
  [key: string]: WebhookAdditionalData;
}
