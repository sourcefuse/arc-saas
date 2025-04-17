import {
  Interceptor,
  InvocationContext,
  Provider,
  Setter,
  ValueOrPromise,
  inject,
  service,
} from '@loopback/core';
import {WebhookConfig, WebhookPayload} from '../types';
import {HttpErrors, RequestContext} from '@loopback/rest';
import {TenantManagementServiceBindings} from '../keys';
import {CryptoHelperService} from '../services';
import {repository} from '@loopback/repository';
import {WebhookSecretRepository} from '../repositories';
import {ILogger, LOGGER} from '@sourceloop/core';
import {timingSafeEqual} from 'crypto';
import {AuthenticationBindings, IAuthUser} from 'loopback4-authentication';

export class WebhookVerifierProvider implements Provider<Interceptor> {
  constructor(
    @inject(TenantManagementServiceBindings.WEBHOOK_CONFIG)
    private readonly webhookConfig: WebhookConfig,
    @service(CryptoHelperService)
    private readonly cryptoHelperService: CryptoHelperService,
    @repository(WebhookSecretRepository)
    private readonly webhookSecretRepo: WebhookSecretRepository,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    private readonly setCurrentUser: Setter<IAuthUser>,
    @inject(TenantManagementServiceBindings.SYSTEM_USER)
    private readonly systemUser: IAuthUser,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  async intercept<T>(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<T>,
  ) {
    const {request} = invocationCtx.parent as RequestContext;
    const value: WebhookPayload = request.body;
    const timestamp = Number(
      request.headers[this.webhookConfig.timestampHeaderName],
    );
    if (isNaN(timestamp)) {
      this.logger.error('Invalid timestamp');
      throw new HttpErrors.Unauthorized();
    }
    const signature = request.headers[this.webhookConfig.signatureHeaderName];
    if (!signature || typeof signature !== 'string') {
      this.logger.error('Missing signature string');
      throw new HttpErrors.Unauthorized();
    }
    const initiatorId = value.initiatorId;

    const secretInfo = await this.webhookSecretRepo.get(initiatorId);
    if (!secretInfo) {
      this.logger.error('No secret found for this initiator');
      throw new HttpErrors.Unauthorized();
    }
    const expectedSignature =
      this.cryptoHelperService.generateHmacForWebhookVerification(
        `${JSON.stringify(value)}${secretInfo.context}`,
        timestamp,
        secretInfo.secret,
      );

    try {
      // actual signature should be equal to expected signature
      // timing safe equal is used to prevent timing attacks
      if (
        !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
      ) {
        this.logger.error('Invalid signature');
        throw new HttpErrors.Unauthorized();
      }
      const TIMESTAMP_TOLERANCE_MS = 20000; // 20 seconds
      // timestamp should be within 5-20 seconds
      if (Math.abs(timestamp - Date.now()) > TIMESTAMP_TOLERANCE_MS) {
        this.logger.error('Timestamp out of tolerance');
        throw new HttpErrors.Unauthorized();
      }
    } catch (e) {
      this.logger.error(e);
      throw new HttpErrors.Unauthorized();
    }

    this.setCurrentUser(this.systemUser);
    return next();
  }
}
