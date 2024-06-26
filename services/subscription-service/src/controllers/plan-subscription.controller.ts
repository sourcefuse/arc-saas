// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {SubscriptionRepository} from '../repositories';
import {get, getModelSchemaRef, param} from '@loopback/openapi-v3';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {Subscription} from '../models';

const baseUrl = '/plans/{id}/subscriptions';

export class PlanSubscriptionController {
  constructor(
    @repository(SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewPlan, PermissionKey.ViewSubscription],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Plan model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Subscription, {includeRelations: true}),
          },
        },
      },
    },
  })
  async find(@param.path.string('id') id: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({where: {planId: id}});
  }
}
