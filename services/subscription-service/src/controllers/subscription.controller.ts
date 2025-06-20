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
import {Subscription} from '../models';
import {SubscriptionRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKey} from '../permissions';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {inject} from '@loopback/core';
import {SubscriptionService} from '../services/subscription.service';

const basePath = '/subscriptions';
const description = 'Array of Subscription model instances';
export class SubscriptionController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @inject('services.SubscriptionService')
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @authorize({
    permissions: [PermissionKey.CreateSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Subscription)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscription, {
            title: 'NewSubscription',
            exclude: ['id', 'startDate', 'endDate'],
          }),
        },
      },
    })
    subscription: Omit<Subscription, 'id' | 'startDate' | 'endDate'>,
  ): Promise<Subscription> {
    return this.subscriptionService.createSubscription(subscription);
  }

  @authorize({
    permissions: [PermissionKey.ViewSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.count(where);
  }

  @authorize({
    permissions: [PermissionKey.ViewSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subscription, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Subscription) filter?: Filter<Subscription>,
  ): Promise<Subscription[]> {
    return this.subscriptionRepository.find(filter);
  }

  @authorize({
    permissions: [PermissionKey.ViewSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/expire-soon`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subscription, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async expireSoonSubscription(
    @param.filter(Subscription) filter?: Filter<Subscription>,
  ): Promise<
    {id: string; daysRemainingToExpiry: number; subscriberId: string}[]
  > {
    return this.subscriptionService.getExpireSoonSubscriptions();
  }

  @authorize({
    permissions: [PermissionKey.ViewSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/expired`, {
    description: 'api that will return newly expired subscription',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subscription, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async expiredSubscription(
    @param.header.number('days') dayCount: number,
    @param.filter(Subscription) filter?: Filter<Subscription>,
  ): Promise<{subscriptionId: string; subscriberId: string}[]> {
    return this.subscriptionService.handleExpiredSubscriptions(dayCount);
  }

  @authorize({
    permissions: [PermissionKey.UpdateSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscription, {partial: true}),
        },
      },
    })
    subscription: Subscription,
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.updateAll(subscription, where);
  }

  @authorize({
    permissions: [PermissionKey.ViewSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Subscription, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Subscription, {exclude: 'where'})
    filter?: FilterExcludingWhere<Subscription>,
  ): Promise<Subscription> {
    return this.subscriptionRepository.findById(id, filter);
  }

  @authorize({
    permissions: [PermissionKey.UpdateSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscription PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscription, {partial: true}),
        },
      },
    })
    subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.updateById(id, subscription);
  }

  @authorize({
    permissions: [PermissionKey.UpdateSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscription PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.replaceById(id, subscription);
  }

  @authorize({
    permissions: [PermissionKey.DeleteSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscription DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionRepository.deleteById(id);
  }
}
