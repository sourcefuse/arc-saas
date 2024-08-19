import {injectable, BindingScope, inject} from '@loopback/core';
import {
  DefaultEventTypes,
  OrchestratorServiceBindings,
  OrchestratorServiceInterface,
} from './types';
import {AnyObject} from '@loopback/repository';
import {
  TenantProvisioningHandler,
  TenantDeprovisioningHandler,
  TenantProvisioningSuccessHandler,
  TenantProvisioningFailureHandler,
  TenantDeploymentHandler,
} from './';

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
    @inject(OrchestratorServiceBindings.TENANT_DEPLOYMENT_HANDLER)
    private handleTenantDeployment: TenantDeploymentHandler,
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
      case DefaultEventTypes.TENANT_PROVISIONING_FAILURE:
        return this.handleTenantProvisioningFailure(eventBody);
      case DefaultEventTypes.TENANT_DEPLOYMENT:
        return this.handleTenantDeployment(eventBody);
      default:
        throw new Error(`Unsupported event type: ${eventType}`);
    }
  }
}
