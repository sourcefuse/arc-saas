import {BindingKey} from '@loopback/context';
import {TierDetailsFn} from './tier-details.service';
import {AnyObject} from '@loopback/repository';

const BINDING_PREFIX = `arc-saas`;

export namespace OrchestratorServiceBindings {
  export const TIER_DETAILS_PROVIDER = BindingKey.create<TierDetailsFn>(
    `${BINDING_PREFIX}.providers.tier-details`,
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
