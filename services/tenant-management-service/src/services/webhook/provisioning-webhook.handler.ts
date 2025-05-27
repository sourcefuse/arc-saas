import {inject, service} from '@loopback/core';
import {Transaction, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {webhookHandler} from '../../decorators';
import {NotificationType, TenantStatus} from '../../enums';
import {WebhookType} from '../../enums/webhook-types.enum';
import {PermissionKey} from '../../permissions';
import {ResourceRepository, TenantRepository} from '../../repositories';
import {
  IWebhookHandler,
  ResourceProvisionedWebhookPayload,
  ResourceTypes,
  WebhookStatus,
} from '../../types';
import {CryptoHelperService} from '../crypto-helper.service';
import {NotificationService} from '../notifications';
import {IPostWebhookHandlerService} from '../../types/i-post-webhook-handler-service.interface';
import {TenantManagementServiceBindings} from '../../keys';
import {SaasTenantRepository} from '../../repositories/saas-tenant.repository';

/**
 * Handler for provisioning webhooks.
 * This class implements the IWebhookHandler interface and defines the type of webhook it handles
 * as `WebhookType.RESOURCES_PROVISIONED`. It provides functionality to handle a webhook payload
 * for resource provisioning, updating the status of a tenant and creating resources associated with the tenant.
 */
@webhookHandler()
export class ProvisioningWebhookHandler implements IWebhookHandler {
  type: WebhookType = WebhookType.RESOURCES_PROVISIONED;

  /**
   * Constructs a new instance of the ProvisioningWebhookHandler.
   * @param {ResourceRepository} resourceRepository - Repository for managing resources.
   * @param {TenantRepository} tenantRepository - Repository for managing tenants.
   * @param {NotificationService} notificationService - Service for sending notifications.
   * @param {CryptoHelperService} cryptoHelperService - Service for cryptographic operations.
   * @param {ILogger} logger - Logger service for logging messages.
   */
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
    @repository(SaasTenantRepository)
    public tenantRepository: TenantRepository,
    @inject('services.NotificationService')
    private notificationService: NotificationService,
    @inject(TenantManagementServiceBindings.PostWebhookHandlerServiceKey)
    private postWebhookHandlerService: IPostWebhookHandlerService<ResourceProvisionedWebhookPayload>,
    @service(CryptoHelperService)
    private cryptoHelperService: CryptoHelperService,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  /**
   * This function handles a webhook payload for resource provisioning, updating the status of a tenant
   * and creating resources associated with the tenant.
   * @param {ResourceProvisionedWebhookPayload} payload - The payload parameter is of type
   * ResourceProvisionedWebhookPayload.
   */
  async handle(payload: ResourceProvisionedWebhookPayload): Promise<void> {
    const transaction = await this.resourceRepository.beginTransaction();
    try {
      const existing = await this.tenantRepository.findOne(
        {
          where: {
            id: payload.initiatorId,
            status: TenantStatus.PROVISIONING,
          },
        },
        {
          transaction,
        },
      );
      if (!existing) {
        this.logger.error('Tenant not found or not in provisioning state');
        throw new HttpErrors.Unauthorized();
      }
      if (payload.data.status === WebhookStatus.SUCCESS) {
        await this.tenantRepository.updateById(
          payload.initiatorId,
          {
            status: TenantStatus.ACTIVE,
          },
          {transaction},
        );
        if (payload.data.resources.length > 0) {
          await this.resourceRepository.create({
            tenantId: payload.initiatorId,
            externalIdentifier: payload.data.resources[0]?.metadata?.bucket,
            type: ResourceTypes.BUCKET,
            metadata: payload.data.resources[0].metadata,
          });
        }
        await this._sendEmail(transaction, payload);
      } else {
        await this.tenantRepository.updateById(
          payload.initiatorId,
          {
            status: TenantStatus.PROVISIONFAILED,
          },
          {transaction},
        );
      }
      await this.postWebhookHandlerService.postWebhookHandler(payload);

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      this.logger.error(e);
      throw e;
    }
  }

  private async _sendEmail(
    transaction: Transaction,
    payload: ResourceProvisionedWebhookPayload,
  ) {
    const tenant = await this.tenantRepository.findById(
      payload.initiatorId,
      {
        include: [
          {
            relation: 'contacts',
            scope: {
              where: {
                isPrimary: true,
              },
              fields: ['email', 'firstName', 'lastName', 'tenantId', 'deleted'],
              order: ['createdOn DESC'],
            },
          },
        ],
      },
      {
        transaction,
      },
    );
    const email = tenant.contacts?.[0]?.email;
    const name = tenant.contacts?.[0]?.firstName;

    if (!email) {
      this.logger.error(`No email found to notify tenant: ${tenant.id}`);
    } else {
      const tempToken = this.cryptoHelperService.generateTempTokenForTenant(
        tenant,
        [
          PermissionKey.CreateNotification,
          PermissionKey.ViewNotificationTemplate,
        ],
      );
      await this.notificationService.send(
        email,
        NotificationType.WelcomeTenant,
        {
          name: tenant.name,
          user: name,
          link: payload.data.appPlaneUrl,
        },
        tempToken,
      );
    }
  }
}
