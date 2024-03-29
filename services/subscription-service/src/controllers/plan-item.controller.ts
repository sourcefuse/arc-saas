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
import {PlanItem} from '../models';
import {PlanItemRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKey} from '../permissions';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';

const basePath = '/plan-items';
export class PlanItemController {
  constructor(
    @repository(PlanItemRepository)
    public planItemRepository: PlanItemRepository,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreatePlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanItem  model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(PlanItem)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanItem, {
            title: 'NewPlanItem',
            exclude: ['id'],
          }),
        },
      },
    })
    planItem: Omit<PlanItem, 'id'>,
  ): Promise<PlanItem> {
    return this.planItemRepository.create(planItem);
  }

  @authorize({
    permissions: [PermissionKey.ViewPlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanItem model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(PlanItem) where?: Where<PlanItem>): Promise<Count> {
    return this.planItemRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewPlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of PlanItem model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PlanItem, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PlanItem) filter?: Filter<PlanItem>,
  ): Promise<PlanItem[]> {
    return this.planItemRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanItem, {partial: true}),
        },
      },
    })
    planItem: PlanItem,
    @param.where(PlanItem) where?: Where<PlanItem>,
  ): Promise<Count> {
    return this.planItemRepository.updateAll(planItem, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewPlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'PlanItem  model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PlanItem, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PlanItem, {exclude: 'where'})
    filter?: FilterExcludingWhere<PlanItem>,
  ): Promise<PlanItem> {
    return this.planItemRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PlanItem PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanItem, {partial: true}),
        },
      },
    })
    planItem: PlanItem,
  ): Promise<void> {
    await this.planItemRepository.updateById(id, planItem);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PlanItem PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() planItem: PlanItem,
  ): Promise<void> {
    await this.planItemRepository.replaceById(id, planItem);
  }

  @authorize({
    permissions: [PermissionKey.DeletePlanItem],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'PlanItem DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.planItemRepository.deleteById(id);
  }
}
