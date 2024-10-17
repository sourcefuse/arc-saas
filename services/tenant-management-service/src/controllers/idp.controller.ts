import { inject, intercept } from '@loopback/core';
import { getModelSchemaRef, post, requestBody } from '@loopback/rest';
import {
    CONTENT_TYPE,
    OPERATION_SECURITY_SPEC,
    rateLimitKeyGenPublic,
    STATUS_CODE,
} from '@sourceloop/core';
import { authorize } from 'loopback4-authorization';
import { ratelimit } from 'loopback4-ratelimiter';
import { TenantManagementServiceBindings, WEBHOOK_VERIFIER } from '../keys';
import { IdpDetailsDTO } from '../models/dtos/idp-details-dto.model';
import { ConfigureIdpFunc, IdPKey } from '../types';

const basePath = '/manage/users';
export class IdpController {
    constructor(
        @inject(TenantManagementServiceBindings.IDP_KEYCLOAK)
        private readonly idpKeycloakProvider:ConfigureIdpFunc<IdpDetailsDTO>
    ) { }
    @intercept(WEBHOOK_VERIFIER)
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
    ): Promise<void> {
        switch (payload.identityProvider) {
            case IdPKey.AUTH0:
            
                break;
            case IdPKey.COGNITO:
            
                break;
            case IdPKey.KEYCLOAK:
                await this.idpKeycloakProvider(payload);
                break;

            default:
                break;
        }

    }
}
