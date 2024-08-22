import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {PlanSizes} from '../models';
import {PlanSizesRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';

const basePath = '/plan-sizes';

export class PlanSizesController {
  constructor(
    @repository(PlanSizesRepository)
    public planSizesRepository: PlanSizesRepository,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreatePlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanSizes model instance',
        content: {'application/json': {schema: getModelSchemaRef(PlanSizes)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanSizes, {
            title: 'NewPlanSizes',
            exclude: ['id'],
          }),
        },
      },
    })
    planSizes: Omit<PlanSizes, 'id'>,
  ): Promise<PlanSizes> {
    return this.planSizesRepository.create(planSizes);
  }

  @authorize({
    permissions: [PermissionKey.ViewPlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanSizes model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(PlanSizes) where?: Where<PlanSizes>,
  ): Promise<Count> {
    return this.planSizesRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewPlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of PlanSizes model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PlanSizes, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PlanSizes) filter?: Filter<PlanSizes>,
  ): Promise<PlanSizes[]> {
    return this.planSizesRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanSizes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanSizes, {partial: true}),
        },
      },
    })
    planSizes: PlanSizes,
    @param.where(PlanSizes) where?: Where<PlanSizes>,
  ): Promise<Count> {
    return this.planSizesRepository.updateAll(planSizes, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewPlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanSizes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PlanSizes, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PlanSizes, {exclude: 'where'})
    filter?: FilterExcludingWhere<PlanSizes>,
  ): Promise<PlanSizes> {
    return this.planSizesRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PlanSizes PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanSizes, {partial: true}),
        },
      },
    })
    planSizes: PlanSizes,
  ): Promise<void> {
    await this.planSizesRepository.updateById(id, planSizes);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PlanSizes PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() planSizes: PlanSizes,
  ): Promise<void> {
    await this.planSizesRepository.replaceById(id, planSizes);
  }

  @authorize({
    permissions: [PermissionKey.DeletePlanSizes],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PlanSizes DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.planSizesRepository.deleteById(id);
  }
}
