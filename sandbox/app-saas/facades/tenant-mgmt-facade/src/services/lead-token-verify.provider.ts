import {Provider, ValueOrPromise} from '@loopback/core';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {LeadUserWithToken} from '../types';
import {repository} from '@loopback/repository';
import {LeadTokenRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
export class LeadTokenVerifierProvider
  implements Provider<VerifyFunction.BearerFn<LeadUserWithToken>>
{
  constructor(
    @repository(LeadTokenRepository)
    public leadTokenRepository: LeadTokenRepository,
  ) {}
  value(): ValueOrPromise<VerifyFunction.BearerFn<LeadUserWithToken>> {
    return async token => {
      const response = await this.leadTokenRepository.get(token);
      if (!response.token) {
        throw new HttpErrors.Unauthorized();
      }
      const data = verify(response.token, process.env.JWT_SECRET!, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['HS256'],
      }) as Object;
      return {
        token: response.token,
        ...data,
      } as LeadUserWithToken;
    };
  }
}
