import {DataObject} from '@loopback/repository';
import {PlanTier, SubscriptionStatus} from '../../enums';
import {Plan, PlanItem, Resource, Service, Subscription} from '../../models';

export const mockService: DataObject<Service> = {
  name: 'test-service',
};

export const mockResource: DataObject<Resource> = {
  name: 'test-resource',
  config: {
    name: 'ec2',
    type: 'aws',
    region: 'us-west-2',
    infra: {
      instanceType: 't2.micro',
      imageId: 'ami-0c55b159cbfafe1f0',
      keyName: 'test-key',
      securityGroupIds: ['sg-0b745256c0eabf70b'],
      subnetId: 'subnet-0c1f7f6c',
      tags: {
        Name: 'test-instance',
      },
    },
  },
};

export const mockPlan: DataObject<Plan> = {
  name: 'test-plan',
  description: 'test-description',
  price: 100,
  currencyId: 'currrency-id',
  billingCycleId: 'test-billing-id',
  tier: PlanTier.POOLED,
};

export const mockPlanItem: DataObject<PlanItem> = {
  name: 'test-plan-item',
  planItemType: 'test-type',
  value: {
    test: 'test',
  },
};

export const mockSubscription: DataObject<Subscription> = {
  subscriberId: 'test-subscriber-id',
  startDate: 'sdsd',
  endDate: 'sdsd',
  status: SubscriptionStatus.ACTIVE,
  planId: 'test-plan-id',
  planDetails: {},
};
