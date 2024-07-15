import {IServiceConfig} from '@sourceloop/core';
import {PlanTier} from '../enums';

export interface ISubscription {
  deleted?: boolean;
  deletedOn?: Date;
  deletedBy?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  id: string;
  subscriberId: string;
  startDate: string;
  endDate: string;
  status: number;
  planId: string;
  plan?: IPlan;
}

// sonarignore:start
export interface ITenantManagementServiceConfig extends IServiceConfig {
  //do nothing
}

export type SubscriptionCreationType = Omit<
  ISubscription,
  | 'id'
  | 'deleted'
  | 'deletedOn'
  | 'deletedBy'
  | 'createdOn'
  | 'modifiedOn'
  | 'createdBy'
  | 'modifiedBy'
  | 'plan'
>;

export type SubscriptionUpdationType = Partial<
  Omit<
    ISubscription,
    | 'id'
    | 'deleted'
    | 'deletedOn'
    | 'deletedBy'
    | 'createdOn'
    | 'modifiedOn'
    | 'createdBy'
    | 'modifiedBy'
    | 'plan'
  >
>;

export interface IBillingCycle {
  deleted: boolean;
  deletedOn?: string;
  deletedBy?: string;
  createdOn: string;
  modifiedOn?: string;
  createdBy: string;
  modifiedBy?: string;
  id: string;
  cycleName: string;
  duration: number;
  durationUnit: string;
  description: string;
}

export interface ICurrency {
  id: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  country: string;
}

export interface IPlan {
  deleted?: boolean;
  deletedOn?: Date;
  deletedBy?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  createdBy?: string;
  modifiedBy?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  currencyId: string;
  metaData: IMetaData;
  tier: PlanTier;
  billingCycleId: string;
  planItems?: IPlanItem[];
  billingCycle?: IBillingCycle;
  currency?: ICurrency;
}

export interface IMetaData {
  pipelineName: string;
}

export interface IPlanItem {
  deleted?: boolean;
  deletedOn?: string;
  deletedBy?: string;
  createdOn?: string;
  modifiedOn?: string;
  createdBy?: string;
  modifiedBy?: string;
  id: string;
  name: string;
  planItemType: string;
  value: IValue;
  planId?: string;
}

export interface IValue {
  name: string;
  value: number | string | boolean;
  serviceId: string;
}
