import {
  Interceptor,
  InvocationContext,
  Provider,
  Setter,
  ValueOrPromise,
  inject,
} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors, RequestContext} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {createHmac, timingSafeEqual} from 'crypto';
import {AuthenticationBindings, IAuthUser} from 'loopback4-authentication';
import {TenantManagementServiceBindings} from '../keys';
import {WebhookSecretRepository} from '../repositories';

const DEFAULT_TIME_TOLERANCE = 20000;

export class CallbackVerifierProvider implements Provider<Interceptor> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @repository(WebhookSecretRepository)
    private readonly webhookSecretRepo: WebhookSecretRepository,
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
    const value: AnyObject = request.body;
    const TIMESTAMP_TOLERANCE = +DEFAULT_TIME_TOLERANCE;
    const timestamp = Number(request.headers['x-timestamp']);
    if (isNaN(timestamp)) {
      this.logger.error('Invalid timestamp');
      throw new HttpErrors.Unauthorized();
    }

    const signature = request.headers['x-signature'];
    if (!signature || typeof signature !== 'string') {
      this.logger.error('Missing signature string');
      throw new HttpErrors.Unauthorized();
    }

    const tenantId = value.tenant?.id;
    if (!tenantId) {
      this.logger.error('Missing secret');
      throw new HttpErrors.Unauthorized();
    }

    const secretInfo = await this.webhookSecretRepo.get(tenantId);
    if (!secretInfo) {
      this.logger.error('No secret found for this initiator');
      throw new HttpErrors.Unauthorized();
    }

    const expectedSignature = createHmac('sha256', secretInfo.secret)
      .update(`${JSON.stringify(value)}${timestamp}`)
      .digest('hex');

    try {
      // actual signature should be equal to expected signature
      // timing safe equal is used to prevent timing attacks
      if (
        !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
      ) {
        this.logger.error('Invalid signature');
        throw new HttpErrors.Unauthorized();
      }

      const hh = Math.abs(timestamp - Date.now());
      // timestamp should be within 20 seconds
      if (hh > TIMESTAMP_TOLERANCE) {
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

export type TempUser = {
  userTenantId: string;
  tenantType: string;
  tenantId?: string;
} & IAuthUser;
