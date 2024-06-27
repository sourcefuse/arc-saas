import {AnyObject} from '@loopback/repository';
import {WebhookType} from '../enums/webhook-types.enum';
import {NotificationType} from '../enums';

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
  type: WebhookType.RESOURCES_PROVISIONED;
  /**
   * The data of the webhook.
   */
  data: {
    status: WebhookStatus.SUCCESS | WebhookStatus.FAILURE;
    resources: AnyObject[];
    appPlaneUrl: string;
  };
};

export interface WebhookNotificationServiceType {
  send<T>(
    email: string,
    type: NotificationType,
    data: T,
    token: string,
  ): Promise<void>;
}
