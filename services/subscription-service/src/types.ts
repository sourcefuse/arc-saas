// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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

export interface IFeature {
  name: string;
  enabled: boolean;
  [key: string]: Object;
}
export interface IService {
  [key: string]: string | {[subKey: string]: IFeature[]};
}
// sonarignore:end
