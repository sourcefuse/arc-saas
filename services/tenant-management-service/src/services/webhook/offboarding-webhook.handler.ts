import {inject} from '@loopback/context';
import {Transaction, repository} from '@loopback/repository';
import {NotificationType, TenantStatus, WebhookType} from '../../enums';
import {ResourceRepository, TenantRepository} from '../../repositories';
import {
  IWebhookHandler,
  ResourceTypes,
  WebhookPayload,
  WebhookStatus,
} from '../../types';
import {NotificationService} from '../notifications';
import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {LOGGER, ILogger} from '@sourceloop/core';
import {CryptoHelperService} from '../crypto-helper.service';
import {OffBoardService} from '../off-board.service';
import {TenantTierDTO} from '../../models/dtos/tenant-tier-dto.model';
import {PermissionKey} from '../../permissions';
import {webhookHandler} from '../../decorators';

@webhookHandler()
export class OffBoardingWebhookHandler implements IWebhookHandler {
  type: WebhookType = WebhookType.TENANT_OFFBOARDING;
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
    @inject('services.NotificationService')
    private notificationService: NotificationService,
    @service(CryptoHelperService)
    private cryptoHelperService: CryptoHelperService,
    @service(OffBoardService)
    private offBoardService: OffBoardService,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}
  async handle(payload: WebhookPayload): Promise<void> {
    const transaction = await this.resourceRepository.beginTransaction();
    try {
      const existing = await this.tenantRepository.findOne(
        {
          where: {
            id: payload.initiatorId,
            status: {
              inq: [TenantStatus.OFFBOARDING, TenantStatus.OFFBOARDING_RETRY],
            },
          },
        },
        {
          transaction,
        },
      );
      if (!existing) {
        this.logger.error('Tenant not found or not in offboarding state');
        throw new HttpErrors.Unauthorized();
      }
      if (payload.data.status === WebhookStatus.SUCCESS) {
        await this.tenantRepository.updateById(
          payload.initiatorId,
          {
            status: TenantStatus.INACTIVE,
          },
          {transaction},
        );
        if (payload.data.resources.length > 0) {
          await this.resourceRepository.deleteAll({
            tenantId: payload.initiatorId,
            type: ResourceTypes.BUCKET,
          });
        }
        await this._sendEmail(transaction, payload);
      } else {
        if (existing.status === TenantStatus.OFFBOARDING_RETRY) {
          await this.tenantRepository.updateById(
            payload.initiatorId,
            {
              status: TenantStatus.ACTIVE,
            },
            {transaction},
          );
        } else {
          await this.tenantRepository.updateById(
            payload.initiatorId,
            {
              status: TenantStatus.OFFBOARDING_RETRY,
            },
            {transaction},
          );

          //re-trigger the pipeline
          await this.offBoardService.offBoardTenant(
            payload.initiatorId,
            new TenantTierDTO({tier: payload.data.tier}),
          );
        }
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      this.logger.error(e);
      throw e;
    }
  }

  private async _sendEmail(transaction: Transaction, payload: WebhookPayload) {
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
