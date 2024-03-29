import {BindingKey} from '@loopback/core';
import {ISubscriptionServiceConfig, LeadUserWithToken} from './types';
import {BINDING_PREFIX} from '@sourceloop/core';
import {VerifyFunction} from 'loopback4-authentication';
import { AnyObject } from '@loopback/repository';

export namespace SubscriptionServiceBindings {
  export const Config = BindingKey.create<ISubscriptionServiceConfig | null>(
    `${BINDING_PREFIX}.chat.config`,
  );
}


export const LEAD_TOKEN_VERIFIER = BindingKey.create<
VerifyFunction.BearerFn<AnyObject>
>('sf.user.lead.verifier');
/**
 * Binding key for the lead token verifier.
 */

