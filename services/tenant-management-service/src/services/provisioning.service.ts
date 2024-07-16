import {repository} from '@loopback/repository';
import {SubscriptionDTO, TenantWithRelations} from '../models';
import {CryptoHelperService} from './crypto-helper.service';
import {service, inject} from '@loopback/core';
import {TenantRepository, WebhookSecretRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {IProvisioningService} from '../types';
import {ILogger, LOGGER} from '@sourceloop/core';
import {TenantStatus} from '../enums';
import {EventConnectorBinding} from '../keys';
import {EventConnector, EventTypes} from './event-connector';
import {randomUUID} from 'crypto';
/**
 * Service for provisioning tenants.
 */
export class ProvisioningService<T extends SubscriptionDTO>
  implements IProvisioningService<T>
{
  /**
   * Constructs a new instance of the ProvisioningService.
   * @param cryptoHelperService - Service for cryptographic operations.
   * @param eventConnector - Event Connector provided by consumer to invoke publish on.
   * @param webhookSecretRepo - Repository for webhook secrets.
   * @param logger - Logger service for logging messages.
   */
  constructor(
    @service(CryptoHelperService)
    private cryptoHelperService: CryptoHelperService,
    @inject(EventConnectorBinding)
    private eventConnector: EventConnector,
    @repository(WebhookSecretRepository)
    private webhookSecretRepo: WebhookSecretRepository,
    @repository(TenantRepository)
    private tenantRepository: TenantRepository,
    @inject(LOGGER.LOGGER_INJECT)
    private logger: ILogger,
  ) {}
  /**
   * The `provisionTenant` function provisions a new tenant by generating a temporary token, retrieving
   * the subscription details, generating a random HMAC secret, starting a build process, and storing the
   * webhook secret and build context to later verify the webhook callback.
   * @param {Tenant} tenant - The `tenant` parameter is an object that represents a tenant. It likely
   * contains information such as the tenant's ID, name, and other relevant details.
   * @param {string} subscription - The `subscription` parameter is an object that contains
   * the details of the subscription opted by the tenant.
   */

  async provisionTenant(
    tenant: TenantWithRelations,
    subscription: T,
  ): Promise<void> {
    await this.tenantRepository.updateById(tenant.id, {
      status: TenantStatus.PROVISIONING,
    });

    if (!subscription.id) {
      throw HttpErrors.BadRequest('Subscription ID is required');
    }
    const hmacSecret = this.cryptoHelperService.generateRandomString(32);

    if (subscription.plan?.tier === undefined) {
      this.logger.error(
        `Tier not found in plan for subscription: ${subscription.id}`,
      );
      throw new HttpErrors.InternalServerError();
    }

    await this.eventConnector.publish({
      type: EventTypes.TENANT_PROVISIONING,
      tenant: tenant,
      subscription: subscription,
    });

    await this.webhookSecretRepo.set(tenant.id, {
      secret: hmacSecret,
      context: randomUUID(),
    });

    await this.webhookSecretRepo.expire(
      tenant.id,
      +process.env.WEBHOOK_SECRET_EXPIRY!,
    );
  }
}
