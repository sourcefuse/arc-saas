import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  rateLimitKeyGenPublic,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {CreateLeadDTO, Lead} from '../models';
import {PermissionKey} from '../permissions';
import {LeadRepository} from '../repositories';
import {OnboardingService} from '../services';
import {ratelimit} from 'loopback4-ratelimiter';
import {TenantManagementServiceBindings} from '../keys';
import {LeadUserWithToken} from '../types';
import {VerifyLeadResponseDTO} from '../models/dtos/verify-lead-response-dto.model';

const basePath = '/leads';
const leadDescription = 'Lead model instance';

export class LeadController {
  constructor(
    @repository(LeadRepository)
    public leadRepository: LeadRepository,
    @service(OnboardingService)
    public onboarding: OnboardingService,
    @inject(RestBindings.Http.REQUEST)
    private readonly request: Request,
  ) {}

  @ratelimit(true, {
    max: parseInt(process.env.PUBLIC_API_MAX_ATTEMPTS ?? '10'),
    keyGenerator: rateLimitKeyGenPublic,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: leadDescription,
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Lead)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(CreateLeadDTO, {
            title: 'CreateLeadDTO',
            exclude: ['isValidated', 'addressId', 'id'],
          }),
        },
      },
    })
    lead: Omit<CreateLeadDTO, 'isValidated' | 'addressId' | 'id'>,
  ): Promise<{[key: string]: string}> {
    return this.onboarding.addLead(lead);
  }

  @authorize({
    permissions: ['*'],
  })
  @authenticate(
    STRATEGY.BEARER,
    {
      passReqToCallback: true,
    },
    undefined,
    TenantManagementServiceBindings.LEAD_TOKEN_VERIFIER,
  )
  @post(`${basePath}/{id}/verify`, {
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
    @inject(AuthenticationBindings.CURRENT_USER)
    leadUser: LeadUserWithToken,
  ): Promise<VerifyLeadResponseDTO> {
    if (leadUser.id !== id) {
      throw new HttpErrors.Unauthorized();
    }
    await this.leadRepository.updateById(leadUser.id, {
      isValidated: true,
    });
    return new VerifyLeadResponseDTO({
      id: leadUser.id,
      token: leadUser.token,
    });
  }

  @authorize({
    permissions: [PermissionKey.ViewLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Lead model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Lead) where?: Where<Lead>): Promise<Count> {
    return this.leadRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
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
  async find(@param.filter(Lead) filter?: Filter<Lead>): Promise<Lead[]> {
    return this.leadRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Lead PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Lead),
          },
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Lead, {partial: true}),
        },
      },
    })
    lead: Lead,
    @param.where(Lead) where?: Where<Lead>,
  ): Promise<Count> {
    throw HttpErrors.MethodNotAllowed();
  }

  @authorize({
    permissions: [PermissionKey.ViewLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: leadDescription,
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Lead)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Lead, {exclude: 'where'})
    filter?: Filter<Lead>,
  ): Promise<Lead> {
    return this.leadRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Lead PATCH success',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Lead),
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Lead, {partial: true}),
        },
      },
    })
    lead: Lead,
  ): Promise<void> {
    throw HttpErrors.MethodNotAllowed();
  }

  @authorize({
    permissions: [PermissionKey.UpdateLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Lead PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() lead: Lead,
  ): Promise<void> {
    throw new HttpErrors.MethodNotAllowed();
  }

  @authorize({
    permissions: [PermissionKey.DeleteLead],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Lead DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    throw HttpErrors.MethodNotAllowed();
  }
}
