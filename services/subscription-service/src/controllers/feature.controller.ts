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

import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKey} from '../permissions';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {Feature} from '../models';
import {FeatureRepository} from '../repositories';

const basePath = '/features';

export class FeatureController {
  constructor(
    @repository(FeatureRepository)
    public featureRepository: FeatureRepository,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Feature)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feature, {
            title: 'NewFeature',
            exclude: ['id'],
          }),
        },
      },
    })
    Feature: Omit<Feature, 'id'>,
  ): Promise<Feature> {
    return this.featureRepository.create(Feature);
  }

  @authorize({
    permissions: [PermissionKey.ViewFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Feature) where?: Where<Feature>): Promise<Count> {
    return this.featureRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Feature, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Feature) filter?: Filter<Feature>,
  ): Promise<Feature[]> {
    return this.featureRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feature, {partial: true}),
        },
      },
    })
    Feature: Feature,
    @param.where(Feature) where?: Where<Feature>,
  ): Promise<Count> {
    return this.featureRepository.updateAll(Feature, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Feature, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Feature, {exclude: 'where'})
    filter?: FilterExcludingWhere<Feature>,
  ): Promise<Feature> {
    return this.featureRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Feature PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feature, {partial: true}),
        },
      },
    })
    Feature: Feature,
  ): Promise<void> {
    await this.featureRepository.updateById(id, Feature);
  }

  @authorize({
    permissions: [PermissionKey.UpdateFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Feature PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() Feature: Feature,
  ): Promise<void> {
    await this.featureRepository.replaceById(id, Feature);
  }

  @authorize({
    permissions: [PermissionKey.DeleteFeature],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Feature DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.featureRepository.deleteById(id);
  }
}
