import {Provider, ValueOrPromise} from '@loopback/core';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {LeadUser, LeadUserWithToken} from '../types';
import {repository} from '@loopback/repository';
import {LeadTokenRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
export class LeadTokenVerifierProvider
  implements Provider<VerifyFunction.BearerFn<LeadUser>>
{
  constructor(
    @repository(LeadTokenRepository)
    public leadTokenRepository: LeadTokenRepository,
  ) {}
  value(): ValueOrPromise<VerifyFunction.BearerFn<LeadUser>> {
    return async token => {
      const response = await this.leadTokenRepository.get(token);
      if (!response.token) {
        throw new HttpErrors.Unauthorized();
      }
      //sonarignore:start
      const data = verify(response.token, process.env.JWT_SECRET!, {
        //sonarignore:end
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
