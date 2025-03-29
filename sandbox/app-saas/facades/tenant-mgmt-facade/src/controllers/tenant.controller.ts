import {authorize} from 'loopback4-authorization';
import {AuthenticationBindings, STRATEGY, authenticate} from 'loopback4-authentication';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/openapi-v3';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {PermissionKey} from '../permissions';
import {CreateTenantWithPlanDTO, Tenant} from '../models';
import {inject, service} from '@loopback/core';
import {TenantHelperService} from '../services';
import { LeadUser } from 'tenant-management-service';
import { SubscriptionBillDTO } from '../models/dtos/subscription-bill-dto.model';

export class TenantController {
  constructor(
    @service(TenantHelperService)
    private readonly tenantHelper: TenantHelperService,
  ) {}
  @authorize({
    permissions: [PermissionKey.CreateTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(`/tenants`, {
    description:
      'This api creates a tenant with a contact, so it also expects contact info in the payload. The start of subscription is the time of creation of tenant and end date of plan depends on the duration of plan.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Tenant)},
        },
      },
    },
  })
  async onboard(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(CreateTenantWithPlanDTO, {
            title: 'CreateTenantDTO',
            exclude: [],
          }),
        },
      },
    })
    dto: CreateTenantWithPlanDTO,
  ): Promise<Tenant> {
    return this.tenantHelper.createTenant(dto);
  }


  @authorize({
    permissions: [PermissionKey.ViewSubscription,PermissionKey.ViewTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get('tenant/Bills', {
    description:
      'This api verifies token sent to a lead to verify his identity',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Lead model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(SubscriptionBillDTO, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findBill(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: LeadUser,
  ):Promise<SubscriptionBillDTO[]>{
    return this.tenantHelper.getTenantBills(currentUser.id);
  }
}
