import {injectable, BindingScope, inject} from '@loopback/core';
import {
  DefaultEventTypes,
  OrchestratorServiceBindings,
  OrchestratorServiceInterface,
} from './types';
import {TenantProvisioningHandler} from './tenant-provisioning-handler.service';
import {AnyObject} from '@loopback/repository';
import {TenantDeprovisioningHandler} from './tenant-deprovisioning-handler.service';
import {TenantProvisioningSuccessHandler} from './tenant-provisioning-success-handler.service';
import {TenantProvisioningFailureHandler} from './tenant-provisioning-failure-handler.service';

@injectable({scope: BindingScope.TRANSIENT})
export class OrchestratorService implements OrchestratorServiceInterface {
  constructor(
    @inject(OrchestratorServiceBindings.TENANT_PROVISIONING_HANDLER)
    private handleTenantProvisioning: TenantProvisioningHandler,
    @inject(OrchestratorServiceBindings.TENANT_DEPROVISIONING_HANDLER)
    private handleTenantDeprovisioning: TenantDeprovisioningHandler,
    @inject(OrchestratorServiceBindings.TENANT_PROVISIONING_SUCCESS_HANDLER)
    private handleTenantProvisioningSuccess: TenantProvisioningSuccessHandler,
    @inject(OrchestratorServiceBindings.TENANT_PROVISIONING_FAILURE_HANDLER)
    private handleTenantProvisioningFailure: TenantProvisioningFailureHandler,
  ) {}

  async handleEvent(
    eventType: DefaultEventTypes,
    eventBody: AnyObject,
  ): Promise<void> {
    switch (eventType) {
      case DefaultEventTypes.TENANT_PROVISIONING:
        return this.handleTenantProvisioning(eventBody);
      case DefaultEventTypes.TENANT_DEPROVISIONING:
        return this.handleTenantDeprovisioning(eventBody);
      case DefaultEventTypes.TENANT_PROVISIONING_SUCCESS:
        return this.handleTenantProvisioningSuccess(eventBody);
      case DefaultEventTypes.TENANT_PROVISIONING_FAILED:
        return this.handleTenantProvisioningFailure(eventBody);
      default:
        throw new Error(`Unsupported event type: ${eventType}`);
    }
  }
}
