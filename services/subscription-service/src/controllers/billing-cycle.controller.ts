import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {post, param, get, patch, put, del, requestBody} from '@loopback/rest';
import {BillingCycle} from '../models';
import {BillingCycleRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKey} from '../permissions';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  getModelSchemaRefSF,
} from '@sourceloop/core';

const basePath = '/billing-cycles';
export class BillinCycleController {
  constructor(
    @repository(BillingCycleRepository)
    public billingCycleRepository: BillingCycleRepository,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCycle model instance',
        content: {
          'application/json': {schema: getModelSchemaRefSF(BillingCycle)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(BillingCycle, {
            title: 'NewBillingCycle',
            exclude: ['id'],
          }),
        },
      },
    })
    billingcycle: Omit<BillingCycle, 'id'>,
  ): Promise<BillingCycle> {
    return this.billingCycleRepository.create(billingcycle);
  }

  @authorize({
    permissions: [PermissionKey.ViewBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCycle model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(BillingCycle) where?: Where<BillingCycle>,
  ): Promise<Count> {
    return this.billingCycleRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of BillingCycle model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(BillingCycle, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(BillingCycle) filter?: Filter<BillingCycle>,
  ): Promise<BillingCycle[]> {
    return this.billingCycleRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCycle PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(BillingCycle, {partial: true}),
        },
      },
    })
    billingcycle: BillingCycle,
    @param.where(BillingCycle) where?: Where<BillingCycle>,
  ): Promise<Count> {
    return this.billingCycleRepository.updateAll(billingcycle, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'BillingCycle model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(BillingCycle, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(BillingCycle, {exclude: 'where'})
    filter?: FilterExcludingWhere<BillingCycle>,
  ): Promise<BillingCycle> {
    return this.billingCycleRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCycle PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(BillingCycle, {partial: true}),
        },
      },
    })
    billingcycle: BillingCycle,
  ): Promise<void> {
    await this.billingCycleRepository.updateById(id, billingcycle);
  }

  @authorize({
    permissions: [PermissionKey.UpdateBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCycle PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() billingcycle: BillingCycle,
  ): Promise<void> {
    await this.billingCycleRepository.replaceById(id, billingcycle);
  }

  @authorize({
    permissions: [PermissionKey.DeleteBillingCycle],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'BillingCycle DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.billingCycleRepository.deleteById(id);
  }
}
