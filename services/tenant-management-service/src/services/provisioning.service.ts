import {repository} from '@loopback/repository';
import {SubscriptionDTO, TenantWithRelations} from '../models';
import {CodeBuildService} from './aws';
import {CryptoHelperService} from './crypto-helper.service';
import {service, inject} from '@loopback/core';
import {TenantRepository, WebhookSecretRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {IPlanItem, IProvisioningService} from '../types';
import {ILogger, LOGGER} from '@sourceloop/core';
import {PlanTier, TenantStatus} from '../enums';
import {PIPELINES} from '../keys';
/**
 * Service for provisioning tenants.
 */
export class ProvisioningService<T extends SubscriptionDTO>
  implements IProvisioningService<T>
{
  /**
   * Constructs a new instance of the ProvisioningService.
   * @param cryptoHelperService - Service for cryptographic operations.
   * @param codeBuildService - Service for AWS CodeBuild related operations.
   * @param webhookSecretRepo - Repository for webhook secrets.
   * @param logger - Logger service for logging messages.
   */
  constructor(
    @service(CryptoHelperService)
    private cryptoHelperService: CryptoHelperService,
    @service(CodeBuildService)
    private codeBuildService: CodeBuildService,
    @repository(WebhookSecretRepository)
    private webhookSecretRepo: WebhookSecretRepository,
    @repository(TenantRepository)
    private tenantRepository: TenantRepository,
    @inject(LOGGER.LOGGER_INJECT)
    private logger: ILogger,
    @inject(PIPELINES)
    private pipelines: Record<PlanTier, string>,
  ) {}
  /**
   * The `provisionTenant` function provisions a new tenant by generating a temporary token, retrieving
   * the subscription details, generating a random HMAC secret, starting a build process, and storing the
   * webhook secret and build context to later verify the webhook callback.
   * @param {Tenant} tenant - The `tenant` parameter is an object that represents a tenant. It likely
   * contains information such as the tenant's ID, name, and other relevant details.
   * @param {string} initiatorId - The `initiatorId` parameter is a string that represents the ID
   * of the entity confirming the initiation of provisioning.
   */

  async provisionTenant(tenant: TenantWithRelations, dto: T): Promise<void> {
    await this.tenantRepository.updateById(tenant.id, {
      status: TenantStatus.PROVISIONING,
    });

    if (!dto.id) {
      throw HttpErrors.BadRequest('Subscription ID is required');
    }
    const hmacSecret = this.cryptoHelperService.generateRandomString(32);

    if (dto.plan?.tier === undefined) {
      this.logger.error(`Tier not found in plan for subscription: ${dto.id}`);
      throw new HttpErrors.InternalServerError();
    }
    if (!this.pipelines[dto.plan?.tier]) {
      this.logger.error(`Pipeline not configured for tier: ${dto.plan?.tier}`);
      throw new HttpErrors.InternalServerError();
    }
    const firstName = tenant.contacts?.[0]?.firstName;
    const lastName = tenant.contacts?.[0]?.lastName;
    const startOutput = await this.codeBuildService.startBuild(
      this.pipelines[dto.plan?.tier],
      {
        TENANT_ID: tenant.id,
        SECRET: hmacSecret,
        TENANT_NAME: this._sanitizeTenantName(tenant.name),
        KEY: tenant.key,
        TENANT_ADMIN_EMAIL: tenant.contacts?.[0]?.email,
        USERNAME: tenant.name,
        TENANT_DATA: JSON.stringify({
          name: tenant.name,
          key: tenant.key,
          address: {
            country: tenant.address?.country,
            state: tenant.address?.state,
            city: tenant.address?.city,
            zip: tenant.address?.zip,
            address: tenant.address?.address,
          },
          contact: {
            firstName: firstName,
            middleName: undefined,
            lastName: lastName,
            email: tenant.contacts?.[0]?.email,
            // not accepting phone of contact as of now
            // phone: tenant.contacts?.[0]?.phone,
          },
        }),
        ...this._buildEnvVars(dto.plan?.planItems ?? []),
      },
    );
    if (!startOutput.build?.id) {
      throw new HttpErrors.InternalServerError('Failed to start build');
    }
    await this.webhookSecretRepo.set(tenant.id, {
      secret: hmacSecret,
      context: startOutput.build.id,
    });
    await this.webhookSecretRepo.expire(
      tenant.id,
      +process.env.WEBHOOK_SECRET_EXPIRY!,
    );
  }

  private _buildEnvVars(planItems: IPlanItem[]) {
    const envVars: {
      [key: IPlanItem['value']['name']]: IPlanItem['value']['value'];
    } = {};
    planItems.forEach(item => {
      envVars[item.value.name] = item.value.value;
    });
    return envVars;
  }

  private _sanitizeTenantName(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/, '');
  }
}
