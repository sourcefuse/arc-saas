import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  RestBindings,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  Request,
  HttpErrors,
  get,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  rateLimitKeyGenPublic,
} from '@sourceloop/core';
import {
  CreateLeadDTO,
  CreateTenantWithPlanDTO,
  Lead,
  Tenant,
  TenantListDTO,
  VerifyLeadResponseDTO,
} from '../models';
import {inject, service} from '@loopback/core';
import {CryptoHelperServiceSunnyt, TenantHelperService} from '../services';
import {PermissionKey} from '../permissions';
import {TenantMgmtProxyService} from '../services/proxies';
import {ratelimit} from 'loopback4-ratelimiter';
import {LEAD_TOKEN_VERIFIER} from '../keys';
import {Filter} from '@loopback/repository';
import { NotificationService } from '../services/notifications';
import { NotificationType } from '../enum';

export class LeadController {
  constructor(
    @service(TenantHelperService)
    private readonly tenantHelper: TenantHelperService,
    @inject('services.TenantMgmtProxyService')
    private readonly tenantMgmtProxyService: TenantMgmtProxyService,
    @inject(RestBindings.Http.REQUEST)
    private readonly request: Request,
    @service(NotificationService)
    private readonly notificationService:NotificationService,
    @service(CryptoHelperServiceSunnyt)
    private readonly cryptoHelperServiceSunnyt:CryptoHelperServiceSunnyt,
    @inject(LOGGER.LOGGER_INJECT)
    private logger: ILogger,
  ) {}

  @ratelimit(true, {
    max: parseInt(process.env.PUBLIC_API_MAX_ATTEMPTS!),
    keyGenerator: rateLimitKeyGenPublic,
  })
  @authorize({
    permissions: ['*'],
  })
  @authenticate(
    STRATEGY.BEARER,
    {
      passReqToCallback: true,
    },
    undefined,
    LEAD_TOKEN_VERIFIER,
  )
  @post(`/leads/{id}/verify`, {
    description:
      'This api verifies token sent to a lead to verify his identity',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'A response with token for the verified lead',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(VerifyLeadResponseDTO),
          },
        },
      },
    },
  })
  async validateLead(
    @param.path.string('id') id: string,
  ): Promise<VerifyLeadResponseDTO> {
    const token = this.request.headers.authorization!;
    return this.tenantMgmtProxyService.verifyLead(token, id);
  }

  @authorize({
    permissions: [PermissionKey.CreateTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(`/leads/{id}/tenants`, {
    description:
      'This api creates a tenant from a lead with a plan. The start of subscription is the time of creation of tenant and end date of plan depends on the duration of plan. The tenant is created with the contact of the lead.',
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
  async tenantFromLead(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(CreateTenantWithPlanDTO, {
            title: 'CreateTenantDTOforLead',
            exclude: ['contact'],
            optional: ['name'],
          }),
        },
      },
    })
    dto: Omit<CreateTenantWithPlanDTO, 'contact'>,
    @param.path.string('id') id: string,
  ): Promise<Tenant> {
    const token = this.request.headers.authorization;
    if (!token) {
      throw HttpErrors.Unauthorized();
    }
    return this.tenantHelper.createTenantFromLead(token, id, dto);
  }

  @ratelimit(true, {
    max: parseInt(process.env.PUBLIC_API_MAX_ATTEMPTS!),
    keyGenerator: rateLimitKeyGenPublic,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(`/leads`, {
    description:
      'This public api creates a prospective lead that could become a tenant. A mail is sent to the lead with a link to validate his email and create a tenant. The lead also acts as the first contact of the tenant later.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Tenant)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(CreateLeadDTO, {
            title: 'CreateLead',
            exclude: ['id', 'isValidated', 'addressId'],
          }),
        },
      },
    })
    lead: Omit<CreateLeadDTO, 'id' | 'isValidated' | 'addressId'>,
  ): Promise<{id:string,key:string}> {
    const leadDTO=await this.tenantMgmtProxyService.createLead(lead);
    // await this.notificationService.send("","ADD LEAD",`${process.env.APP_VALIDATE_URL}/${leadDTO.id}?code=${leadDTO.key}`);
    
    this.notificationService
      .send(
        lead.email,
        NotificationType.ValidateLead,
        {
          appName: process.env.APP_NAME,
          link: `${process.env.APP_VALIDATE_URL}/${leadDTO.id}?code=${leadDTO.key}`,
        },
        this.cryptoHelperServiceSunnyt.generateTempToken(
          {
            ...lead,
            permissions:[
              PermissionKey.CreateNotification,
              PermissionKey.ViewNotificationTemplate,
            ]
          }
        )
        ,
      )
      .catch(e => this.logger.error(e));
    return leadDTO;
  }

  @authorize({
    permissions: [PermissionKey.ViewLead, PermissionKey.ViewTenant],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`/leads/tenants`, {
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
              items: getModelSchemaRef(Lead, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async getLeadsAndTenants(): Promise<TenantListDTO[]> {
    const token = this.request.headers.authorization!;
    const leadFilter: Filter<Lead> = {
      where: {
        isValidated: true,
      },
    };
    let leads = await this.tenantMgmtProxyService.getLeads(token, leadFilter);
    const leadIds = leads.map(lead => lead.id);
    const tenantFilter: Filter<Tenant> = {
      where: {
        leadId: {
          inq: leadIds,
        },
      },
    };
    const tenants = await this.tenantMgmtProxyService.getTenants(
      token,
      tenantFilter,
    );

    leads = leads.filter(lead =>
      tenants.some(tenant => tenant.leadId === lead.id),
    );

    const matchedArray: TenantListDTO[] = leads
      .filter(leadObj =>
        tenants.some(tenantObj => tenantObj.leadId === leadObj.id),
      )
      .map(leadObj => {
        const matchingTenant = tenants.find(
          tenantObj => tenantObj.leadId === leadObj.id,
        );
        return {
          email: leadObj.email,
          companyName: leadObj.companyName,
          name: matchingTenant?.name,
          domains: matchingTenant?.domains.join(','),
          id: matchingTenant?.id,
        };
      });
    return matchedArray;
  }
}
