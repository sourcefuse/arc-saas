import {SubscriptionDTO, Tenant} from '../models';

export interface IProvisioningService<T extends SubscriptionDTO> {
  provisionTenant(tenant: Tenant, dto: T): Promise<void>;
}
