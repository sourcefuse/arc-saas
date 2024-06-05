import {AnyObject, DataObject, DeepPartial} from '@loopback/repository';
import {
  InvoiceStatus,
  NotificationType,
  PlanTier,
  TenantStatus,
} from '../../enums';
import {
  Address,
  Contact,
  Invoice,
  Tenant,
  TenantOnboardDTO,
} from '../../models';
import {WebhookType} from '../../enums/webhook-types.enum';
import {
  IPlan,
  ISubscription,
  ResourceData,
  ResourceTypes,
  WebhookPayload,
  WebhookStatus,
} from '../../types';
import {CreateLeadDTO} from '../../models/dtos/create-lead-dto.model';

export const mockLeadId = 'test-lead-id';

export const testTemplates: AnyObject = {
  [NotificationType.ValidateLead]: {
    subject: '{{appName}}',
    body: '{{{link}}}',
  },
  [NotificationType.WelcomeTenant]: {
    subject: '{{name}}',
    body: `${JSON.stringify({
      link: '{{{link}}}',
      name: '{{{name}}}',
      user: '{{{user}}}',
    })}`,
  },
};

export const mockLead = {
  firstName: 'test-lead',
  lastName: 'NA',
  email: 'test@contact.com',
  companyName: 'test-company',
};

export const testAddress = 'test-address';
export const testState = 'test-state';

export const mockLeadDTO: DataObject<CreateLeadDTO> = {
  ...mockLead,
  address: {},
};

export const mockAddress: DataObject<Address> = {
  address: testAddress,
  city: 'test-city',
  state: testState,
  country: 'test-country',
  zip: 'test-zip',
};

export const mockInvoice: DataObject<Invoice> = {
  amount: 100,
  currencyCode: 'USD',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  dueDate: '2024-02-15',
  status: InvoiceStatus.PENDING,
  tenantId: 'test-tenant-id',
};

export const testDomain = 'contact.com';

export const mockTenantOnboardDTO: DataObject<TenantOnboardDTO> = {
  contact: {
    firstName: mockLead.firstName,
    lastName: mockLead.lastName,
    email: mockLead.email,
    isPrimary: true,
  },
  name: 'test-name',
  country: 'India',
  address: testAddress,
  city: 'test-city',
  state: testState,
  zip: 'test-zip',
  key: 'testkey',
  domains: [testDomain],
};
export const mockSubscriptionId = 'test-subscription-id';

export const mockSusbcription: DeepPartial<ISubscription> = {
  id: '1',
  plan: {
    tier: PlanTier.POOLED,
    planItems: [],
  },
};

export const mockPlan: DeepPartial<IPlan> = {
  price: 100,
  billingCycle: {
    duration: 1,
    durationUnit: 'month',
  },
  currency: {
    currencyCode: 'USD',
  },
};

export const DateFormat = 'YYYY-MM-DD';

export const mockContact: DataObject<Contact> = {
  firstName: 'test-contact',
  lastName: 'NA',
  email: 'test@contact.com',
  isPrimary: false,
};

export const mockTenant: DataObject<Tenant> = {
  name: 'test-name',
  status: TenantStatus.ACTIVE,
  spocUserId: 'test-user-id',
  key: 'test',
  domains: [testDomain],
};

export const mockDto: TenantOnboardDTO = new TenantOnboardDTO({
  name: 'test-name',
  country: 'India',
  address: testAddress,
  city: 'test-city',
  state: 'test-state',
  zip: 'test-zip',
  key: 'testkey',
  domains: [testDomain],
});

export const mockWebhookPayload: WebhookPayload = {
  initiatorId: 'user-id-1',
  type: WebhookType.RESOURCES_PROVISIONED,
  data: {
    status: WebhookStatus.SUCCESS,
    resources: [
      buildResource(ResourceTypes.BUCKET, {
        bucket: 'bucket',
        path: 'path',
      }),
    ],
    appPlaneUrl: 'redirectUrl',
    tier: PlanTier.SILO,
  },
};

export const mockOffboardingWebhookPayload: WebhookPayload = {
  initiatorId: 'user-id-1',
  type: WebhookType.TENANT_OFFBOARDING,
  data: {
    status: WebhookStatus.SUCCESS,
    resources: [],
    appPlaneUrl: '',
    tier: PlanTier.SILO,
  },
};

export function buildResource<T extends ResourceData>(
  type: T['type'],
  metadata: T['metadata'],
) {
  return {
    type,
    externalIdentifier: `${type}-id-${Math.round(Math.random() * 100)}`,
    metadata,
  };
}
