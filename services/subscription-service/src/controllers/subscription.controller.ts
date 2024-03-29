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
import moment, {unitOfTime} from 'moment';
import {Subscription} from '../models';
import {BillingCycleRepository, PlanRepository, SubscriptionRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {PermissionKey} from '../permissions';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import { SubscriptionStatus } from '../enums';

const basePath = '/subscriptions';
const DATE_FORMAT = 'YYYY-MM-DD';
const SECONDS_IN_ONE_HOUR = 60 * 60;
export class SubscriptionController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @repository(PlanRepository)
    public planRepository:PlanRepository,
    @repository(BillingCycleRepository)
    public billingCycleRepository:BillingCycleRepository
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
            exclude: ['id','startDate','endDate'],
          }),
        },
      },
    })
    subscription: Omit<Subscription, 'id'| 'startDate'|'endDate'>,
  ): Promise<Subscription> {
    const plan=await  this.planRepository.findById(subscription.planId);
    const billingCycle=await this.billingCycleRepository.findById(plan.billingCycleId);

    const startDate = moment().format(DATE_FORMAT);
    const endDate = moment()
      .add(
        billingCycle.duration,
        this._unitMap(billingCycle.durationUnit),
      )
      .format(DATE_FORMAT);
    
    return this.subscriptionRepository.create({...subscription,startDate,endDate});
  }
  private _unitMap(durationUnit: string): unitOfTime.DurationConstructor {
    switch (durationUnit) {
      case 'month':
        return 'M';
      case 'year':
        return 'y';
      case 'week':
        return 'week';
      default:
        return 'days';
    }
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
        description: 'Array of Subscription model instances',
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
        description: 'Array of Subscription model instances',
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
  ):Promise<{ id: string, daysRemainingToExpiry: number, subscriberId: string }[]> {

    const daysRemaining = 7;
    const subscriptions=await this.subscriptionRepository.find({
      where: {status: SubscriptionStatus.ACTIVE},
    });


    const expiringSoonSubscriptionObj = [];

    for (const subscription of subscriptions) {
      // check for if less then 7 days remaining and send notification
      if (
        moment(subscription.endDate).isBefore(
          moment().add(daysRemaining, 'days'),
        ) &&
        moment(subscription.endDate).isAfter(moment())
      ) {
        const daysRemainingToExpiry = moment(subscription.endDate).diff(
          moment(),
          'days',
        );
        expiringSoonSubscriptionObj.push({
          id: subscription.id,
          daysRemainingToExpiry,
          subscriberId: subscription.subscriberId,
        });
      }
    }
    return expiringSoonSubscriptionObj;
  }




  @authorize({
    permissions: [PermissionKey.ViewSubscription],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(`${basePath}/expired`, {
    description:'api that will return newly expired subscription',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Subscription model instances',
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
  ): Promise<{ subscriptionId: string; subscriberId: string; }[]> {

      const subscriptions=await this.subscriptionRepository.find({
        where: {status: SubscriptionStatus.ACTIVE},
      });

      const markSubscriptionsAsExpiredPromises = [];
      for (const subscription of subscriptions) {
        // check for if subscription is expired

        if (moment(subscription.endDate).isBefore(moment())) {

          markSubscriptionsAsExpiredPromises.push(

            this.subscriptionRepository.updateById(subscription.id, {
              status: SubscriptionStatus.EXPIRED,
            })
          );
        }
    }
    await Promise.all(markSubscriptionsAsExpiredPromises);
    // calculate date before dayCount number of days from current date
    const range=moment().subtract(dayCount,'days').format(DATE_FORMAT);
    const expiredSubscriptionWithInRange=[];
    const expiredSubscription=await this.subscriptionRepository.find({
      where:{status:SubscriptionStatus.EXPIRED}
    });
    for(const subscription of expiredSubscription){
      if(moment(subscription.endDate).isAfter(range)){
        expiredSubscriptionWithInRange.push({
          subscriptionId:subscription.id,
          subscriberId: subscription.subscriberId,
        })
      }
    }
    return expiredSubscriptionWithInRange;
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
