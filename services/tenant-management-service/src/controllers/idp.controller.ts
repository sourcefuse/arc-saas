import {intercept, service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  rateLimitKeyGenPublic,
  STATUS_CODE,
} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {ratelimit} from 'loopback4-ratelimiter';
import {CALLABCK_VERIFIER} from '../keys';
import {IdpDetailsDTO} from '../models/dtos/idp-details-dto.model';
import {IdpResp} from '../types';
import {IdpHelperService} from '../services/idp-helper.service';

const basePath = '/manage/users';
export class IdpController {
  constructor(
    @service(IdpHelperService)
    public idpService: IdpHelperService,
  ) {}

  @intercept(CALLABCK_VERIFIER)
  @ratelimit(true, {
    max: parseInt(process.env.WEBHOOK_API_MAX_ATTEMPTS ?? '10'),
    keyGenerator: rateLimitKeyGenPublic,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(`${basePath}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Webhook success',
      },
    },
  })
  async idpConfigure(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(IdpDetailsDTO, {
            title: 'IdpDetailsDTO',
          }),
        },
      },
    })
    payload: IdpDetailsDTO,
  ): Promise<IdpResp> {
    return this.idpService.configureIdp(payload);
  }
}
