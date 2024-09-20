// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IInvoice} from 'loopback4-billing';
import {IServiceConfig} from '@sourceloop/core';

// sonarignore:start
export interface ISubscriptionServiceConfig extends IServiceConfig {
  //do nothing
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

export const SubscriptionDbSourceName = 'SubscriptionDB';
// sonarignore:end

export type InvoiceStatus =
  | 'paid'
  | 'posted'
  | 'payment_due'
  | 'not_paid'
  | 'voided'
  | 'pending';

export interface IPayload {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  event_type: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  webhook_status: string;
  content: IContent;
}

export interface IContent {
  invoice: IInvoice;
}
