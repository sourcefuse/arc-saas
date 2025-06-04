import {BindingKey, Interceptor} from '@loopback/core';
import {ISubscriptionServiceConfig} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';
import {VerifyFunction} from 'loopback4-authentication';
import {AnyObject} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authorization';

export namespace SubscriptionServiceBindings {
  export const Config = BindingKey.create<ISubscriptionServiceConfig>(
    `${BINDING_PREFIX}.task.config`,
  );
}

export const WEBHOOK_VERIFIER = BindingKey.create<Interceptor>(
  'sf.webhook.verifier',
);

/**
 * Binding key for the lead token verifier.
 */
export const LEAD_TOKEN_VERIFIER = BindingKey.create<
  VerifyFunction.BearerFn<AnyObject>
>('sf.user.lead.verifier');

/**
 * Binding key for the system user.
 */
export const SYSTEM_USER = BindingKey.create<IAuthUser & AnyObject>(
  'sf.user.system',
);
