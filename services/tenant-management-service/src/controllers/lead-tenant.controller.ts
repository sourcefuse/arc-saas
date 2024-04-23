import {inject, service} from '@loopback/core';
import {
  post,
  requestBody,
  getModelSchemaRef,
  param,
  HttpErrors,
} from '@loopback/rest';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  CONTENT_TYPE,
  rateLimitKeyGenPublic,
  LOGGER,
  ILogger,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {OnboardingService} from '../services';
import {LeadUser} from '../types';
import {Tenant, TenantOnboardDTO} from '../models';
import {ratelimit} from 'loopback4-ratelimiter';

const basePath = '/leads/{id}/tenants';
export class LeadTenantController {
  constructor(
    @service(OnboardingService)
    public onboardingService: OnboardingService,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  @ratelimit(true, {
    max: parseInt(process.env.PUBLIC_API_MAX_ATTEMPTS!),
    keyGenerator: rateLimitKeyGenPublic,
  })
  @authorize({
    permissions: ['*'],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
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
    @inject(AuthenticationBindings.CURRENT_USER)
    leadUser: LeadUser,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TenantOnboardDTO, {
            title: 'TenantOnboardDto',
            exclude: ['contact'],
            optional: ['name'],
          }),
        },
      },
    })
    dto: Omit<
      TenantOnboardDTO,
      'contact' | 'address' | 'city' | 'state' | 'zip' | 'country'
    >,
    @param.path.string('id') id: string,
  ): Promise<Tenant> {
    if (leadUser.id !== id) {
      this.logger.error('Lead id does not match with the id in token');
      throw new HttpErrors.Unauthorized();
    }
    return this.onboardingService.onboardForLead(dto, leadUser);
  }
}
