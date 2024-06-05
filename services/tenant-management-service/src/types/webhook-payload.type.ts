import {AnyObject} from '@loopback/repository';
import {WebhookType} from '../enums/webhook-types.enum';
import {NotificationType, PlanTier} from '../enums';

export enum WebhookStatus {
  FAILURE,
  SUCCESS,
}
/**
 * Represents the payload for a webhook.
 */
export type WebhookPayload = ResourceProvisionedWebhookPayload;

/**
 * Represents the payload for a resource provisioned webhook.
 */
export type ResourceProvisionedWebhookPayload = {
  /**
   * The ID of the initiator.
   */
  initiatorId: string;
  /**
   * The type of the webhook.
   */
  type: WebhookType;
  /**
   * The data of the webhook.
   */
  data: {
    status: WebhookStatus.SUCCESS | WebhookStatus.FAILURE;
    resources: AnyObject[];
    appPlaneUrl: string;
    tier: PlanTier;
  };
};

export type SecretInfo = {secret: string; context: string};

// export interface WebhookNotificationServiceType{
//   send(email: string, type: NotificationType, data: WebNotifiactionDataType, token: string):Promise<void>
// }

export interface WebhookNotificationServiceType {
  send<T>(
    email: string,
    type: NotificationType,
    data: T,
    token: string,
  ): Promise<void>;
}
