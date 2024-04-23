import {BindingScope, inject, injectable, service} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {Lead} from '../models';
import {PermissionKey} from '../permissions';
import {NotificationService} from './notifications';
import {CryptoHelperService} from './crypto-helper.service';
import {repository} from '@loopback/repository';
import {LeadTokenRepository} from '../repositories';

/**
 * Helper service for authenticating leads.
 */
@injectable({scope: BindingScope.SINGLETON})
export class LeadAuthenticator {
  /**
   * Constructs a new instance of the LeadAuthenticatorService.
   * @param {NotificationService} notificationService - Service for sending notifications.
   * @param {CryptoHelperService} cryptoHelperService - Service for cryptographic operations.
   * @param {ILogger} logger - Logger service for logging messages.
   */
  constructor(
    @service(NotificationService)
    private notificationService: NotificationService,
    @service(CryptoHelperService)
    private cryptoHelperService: CryptoHelperService,
    @repository(LeadTokenRepository)
    private leadTokenRepository: LeadTokenRepository,
    @inject(LOGGER.LOGGER_INJECT)
    private logger: ILogger,
  ) {}
  /**
   * The function `triggerValidationMail` sends a validation email to a lead with a
   * generated temporary token to validate his email id.
   * @param {Lead} lead - The `lead` parameter is an object that represents a lead.
   * It likely contains information about a potential customer or user, such as their
   * name, email address, and other relevant details.
   */
  async triggerValidationMail(lead: Lead) {
    const token = this._generateTempToken(lead, [
      PermissionKey.CreateTenant,
      PermissionKey.ProvisionTenant,
      PermissionKey.ViewLead,
      PermissionKey.ViewPlan,
      PermissionKey.ViewSubscription,
      PermissionKey.CreateInvoice,
    ]);
    const randomKey = this.cryptoHelperService.generateRandomString(
      +process.env.LEAD_KEY_LENGTH!,
    );
    await this.leadTokenRepository.set(randomKey, {token});
    await this.leadTokenRepository.expire(
      randomKey,
      +process.env.VALIDATION_TOKEN_EXPIRY!,
    );
    return randomKey;
    // this.notificationService
    //   .send(
    //     lead.email,
    //     NotificationType.ValidateLead,
    //     {
    //       appName: process.env.APP_NAME,
    //       link: `${process.env.APP_VALIDATE_URL}/${lead.id}?code=${randomKey}`,
    //     },
    //     this._generateTempToken(lead, [
    //       PermissionKey.CreateNotification,
    //       PermissionKey.ViewNotificationTemplate,
    //     ]),
    //   )
    //   .catch(e => this.logger.error(e));
  }

  /**
   * The function `_generateTempToken` generates a temporary token for a lead with
   * specified permissions.
   * @param {Lead} lead - The `lead` parameter is an object that represents a lead.
   * It contains properties such as `id`, `userTenantId`, and `email`. These
   * properties are used to generate a temporary token.
   * @param {string[]} permissions - The `permissions` parameter is an optional array
   * of strings that represents the permissions associated with the lead. These
   * permissions determine what actions the lead is allowed to perform within the
   * system using the generated token
   * @returns a signed token.
   */
  private _generateTempToken(lead: Lead, permissions: string[] = []) {
    return this.cryptoHelperService.generateTempTokenForLead(lead, permissions);
  }
}
