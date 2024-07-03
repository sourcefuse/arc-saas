import {CreateLeadDTO, CreateTenantWithPlanDTO, Lead, Tenant} from '../models';
import {IPlan, ISubscription} from '../services/proxies';

export const mockLeadId = 'lead-id';
export const mockToken = 'token';
export const dateFormat = 'YYYY-MM-DD';

export function buildCreateTenantDto() {
  return new CreateTenantWithPlanDTO({
    planId: 'plan-id',
    name: 'dummy tenant',
    key: 'dummytenan',
    domains: ['dummytenant.com'],
  });
}

export function buildCreateLeadDto() {
  return new CreateLeadDTO({
    email: 'test.com',
    firstName: 'test',
    companyName: 'test-sf',
  });
}

export function buildTenant() {
  return new Tenant({
    id: 'tenant-id',
  });
}

export function buildLead() {
  return new Lead({
    id: 'lead-id',
  });
}

export function buildPlan(durationUnit = 'month'): IPlan {
  return {
    id: 'plan-id',
    billingCycle: {
      duration: 1,
      durationUnit,
    },
    currency: {
      currencyCode: 'USD',
    },
    name: 'plan-name',
  } as unknown as IPlan;
}

export function buildSubscription() {
  return {
    id: 'subscription-id',
  } as unknown as ISubscription;
}
