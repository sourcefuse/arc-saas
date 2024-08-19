import {BindingKey} from '@loopback/context';
import {TierDetailsFn} from './tier-details.service';
import {TenantProvisioningHandler} from './tenant-provisioning-handler.service';
import {TenantDeprovisioningHandler} from './tenant-deprovisioning-handler.service';
import {AnyObject} from '@loopback/repository';
import {TenantProvisioningSuccessHandler} from './tenant-provisioning-success-handler.service';
import {TenantProvisioningFailureHandler} from './tenant-provisioning-failure-handler.service';
import {TenantDeploymentHandler} from './tenant-deployment-handler.service';

const BINDING_PREFIX = `arc-saas`;

export namespace OrchestratorServiceBindings {
  export const TIER_DETAILS_PROVIDER = BindingKey.create<TierDetailsFn>(
    `${BINDING_PREFIX}.providers.tier-details`,
  );
  export const TENANT_PROVISIONING_HANDLER =
    BindingKey.create<TenantProvisioningHandler>(
      `${BINDING_PREFIX}.providers.tenant-provisioning-handler`,
    );
  export const TENANT_DEPROVISIONING_HANDLER =
    BindingKey.create<TenantDeprovisioningHandler>(
      `${BINDING_PREFIX}.providers.tenant-deprovisioning-handler`,
    );
  export const TENANT_PROVISIONING_SUCCESS_HANDLER =
    BindingKey.create<TenantProvisioningSuccessHandler>(
      `${BINDING_PREFIX}.providers.tenant-provisioning-success-handler`,
    );
  export const TENANT_PROVISIONING_FAILURE_HANDLER =
    BindingKey.create<TenantProvisioningFailureHandler>(
      `${BINDING_PREFIX}.providers.tenant-provisioning-failure-handler`,
    );
  export const TENANT_DEPLOYMENT_HANDLER =
    BindingKey.create<TenantDeploymentHandler>(
      `${BINDING_PREFIX}.providers.tenant-deployment-handler`,
    );
  export const BUILDER_SERVICE = BindingKey.create<BuilderServiceInterface>(
    `${BINDING_PREFIX}.services.builder-service`,
  );
  export const ORCHESTRATOR_SERVICE =
    BindingKey.create<OrchestratorServiceInterface>(
      `${BINDING_PREFIX}.services.orchestrator-service`,
    );
}

export interface OrchestratorServiceInterface<
  EventType extends string = DefaultEventTypes,
  BodyType extends AnyObject = AnyObject,
> {
  handleEvent(eventType: EventType, eventBody: BodyType): Promise<void>;
}

export interface BuilderServiceInterface {
  startJob(jobIdentifier: string, params: AnyObject): Promise<void>;
}

export enum DefaultEventTypes {
  TENANT_PROVISIONING = 'TENANT_PROVISIONING',
  TENANT_DEPROVISIONING = 'TENANT_DEPROVISIONING',
  TENANT_PROVISIONING_SUCCESS = 'TENANT_PROVISIONING_SUCCESS',
  TENANT_PROVISIONING_FAILURE = 'TENANT_PROVISIONING_FAILURE',

  TENANT_DEPLOYMENT = 'TENANT_DEPLOYMENT',
  TENANT_DEPLOYMENT_SUCCESS = 'TENANT_DEPLOYMENT_SUCCESS',
  TENANT_DEPLOYMENT_FAILURE = 'TENANT_DEPLOYMENT_FAILURE',
}
