import {inject, intercept} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  rateLimitKeyGenPublic,
  STATUS_CODE,
} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
import {ratelimit} from 'loopback4-ratelimiter';
import {TenantManagementServiceBindings, CALLABCK_VERIFIER} from '../keys';
import {IdpDetailsDTO} from '../models/dtos/idp-details-dto.model';
import {ConfigureIdpFunc, IdPKey, IdpResp} from '../types';

const basePath = '/manage/users';
export class IdpController {
  constructor(
    @inject(TenantManagementServiceBindings.IDP_KEYCLOAK)
    private readonly idpKeycloakProvider: ConfigureIdpFunc<IdpResp>,
    @inject(TenantManagementServiceBindings.IDP_AUTH0)
    private readonly idpAuth0Provider: ConfigureIdpFunc<IdpResp>,
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
    const res: IdpResp = {
      authId: '',
    };
    switch (payload.tenant.identityProvider) {
      case IdPKey.AUTH0: {
        const auth0Resp = await this.idpAuth0Provider(payload);
        return auth0Resp;
      }
      case IdPKey.COGNITO:
        break;

      case IdPKey.KEYCLOAK: {
        const keycloakResp = await this.idpKeycloakProvider(payload);
        return keycloakResp;
      }
      default:
        break;
    }
    return res;
  }
}
