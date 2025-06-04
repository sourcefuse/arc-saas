import {
  Interceptor,
  InvocationContext,
  Provider,
  Setter,
  ValueOrPromise,
  inject,
} from '@loopback/core';
import {HttpErrors, RequestContext} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings, IAuthUser} from 'loopback4-authentication';
import {SYSTEM_USER} from '../keys';

export class WebhookVerifierProvider implements Provider<Interceptor> {
  constructor(
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    private readonly setCurrentUser: Setter<IAuthUser>,
    @inject(SYSTEM_USER)
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
    const authHeader = request.headers['authorization'];
    const username = process.env.WEBHOOK_USERNAME;
    const password = process.env.WEBHOOK_PASSWORD;
    const expectedAuthHeader =
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    try {
      if (!authHeader || authHeader !== expectedAuthHeader) {
        throw new HttpErrors.Unauthorized('Invalid authorization.');
      }
    } catch (e) {
      this.logger.error(e);
      throw new HttpErrors.Unauthorized();
    }

    this.setCurrentUser(this.systemUser);
    return next();
  }
}
