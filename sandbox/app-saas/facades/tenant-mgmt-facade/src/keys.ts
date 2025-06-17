import {BindingKey} from '@loopback/context';
import {LeadUserWithToken} from './types';
import {VerifyFunction} from 'loopback4-authentication';

/**
 * Binding key for the lead token verifier.
 */
export const LEAD_TOKEN_VERIFIER = BindingKey.create<
  VerifyFunction.BearerFn<LeadUserWithToken>
>('sf.user.lead.verifier');
