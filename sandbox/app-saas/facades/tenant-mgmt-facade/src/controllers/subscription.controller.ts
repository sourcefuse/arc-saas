import {inject} from '@loopback/context';
import {post, getModelSchemaRef, requestBody} from '@loopback/openapi-v3';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  CONTENT_TYPE,
} from '@sourceloop/core';
import {
  authenticate,
  STRATEGY,
  AuthenticationBindings,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Tenant, CheckBillingSubscriptionsDTO} from '../models';
import {LeadUser} from '../types';
import {service} from '@loopback/core';
import {TenantHelperService} from '../services';
import { get } from 'http';
import { SubscriptionBillDTO } from '../models/dtos/subscription-bill-dto.model';
import { RestBindings,Request } from '@loopback/rest';
import { PermissionKey } from '../permissions';

const basePath = '/subscriptions';

export class SubscriptionController {
  constructor(
    @service(TenantHelperService)
    private readonly tenantHelper: TenantHelperService
  ) {}


  @authorize({
    permissions: ['*'],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(`${basePath}/send-reminders`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Check billing subscription response',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Tenant)},
        },
      },
    },
  })
  async checkBillingSubscriptions(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: LeadUser,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(CheckBillingSubscriptionsDTO, {
            title: 'CheckBillingSubscriptionsDTO',
          }),
        },
      },
    })
    dto: CheckBillingSubscriptionsDTO,
  ): Promise<void> {
    this.tenantHelper
      .checkBillingSubscriptions(currentUser.id, dto)
      .catch(err => {
        console.error(err); //NOSONAR
      });
  }


 

}
