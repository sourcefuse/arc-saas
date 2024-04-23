// import { PlanTier } from '../enums';
// import {ProvisioningDTO, Tenant} from '../models';
// import { PlanItemDTO } from '../models/dtos/plan-item-dto.model';
// import { IPlanItem } from './i-subscription.interface';

// export interface IProvisioningService<T extends PlanItemDTO> {
//   provisionTenant(tenant: Tenant, dto: T[],tier:PlanTier,subscriptionId:string): Promise<void>;
// }

import {SubscriptionDTO, Tenant} from '../models';

export interface IProvisioningService<T extends SubscriptionDTO> {
  provisionTenant(tenant: Tenant, dto: T): Promise<void>;
}
