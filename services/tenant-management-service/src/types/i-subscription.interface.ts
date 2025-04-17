import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';

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
export interface TenantManagementServiceConfig extends IServiceConfig {
  useCustomSequence:boolean,
  useSequelize?:boolean
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
  tier: string;
  size?: string;
  sizeConfig?: AnyObject;
  billingCycleId: string;
  billingCycle?: IBillingCycle;
  currency?: ICurrency;
}

export interface IMetaData {
  pipelineName: string;
}
