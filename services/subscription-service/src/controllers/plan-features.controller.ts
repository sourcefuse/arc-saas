import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {param, get, post, requestBody, patch} from '@loopback/rest';
import {
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  getModelSchemaRefSF,
} from '@sourceloop/core';
import {Plan} from '../models';
import {
  Feature,
  FeatureValues,
  FeatureValuesRepository,
} from '@sourceloop/feature-toggle-service';
import {DataObject, repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {PlanFeaturesService} from '../services/plan-features-helper.service';

const basePath = 'plans/{id}/features';

export class PlanFeaturesController {
  constructor(
    @repository(FeatureValuesRepository)
    public featureValuesRepository: FeatureValuesRepository,
    @inject('services.PlanFeaturesService')
    private readonly planFeaturesService: PlanFeaturesService,
  ) {}

  @authorize({
    permissions: [PermissionKey.ViewPlanFeatures],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Plan Features Retrieved',
        content: {
          'application/json': {
            schema: {
              ...getModelSchemaRefSF(Plan),
              ...getModelSchemaRefSF(FeatureValues),
            },
          },
        },
      },
    },
  })
  async getPlanFeatures(@param.path.string('id') id: string): Promise<
    DataObject<Plan> & {
      features: DataObject<Feature & {values: FeatureValues[]}>[];
    }
  > {
    return this.planFeaturesService.planFeatures(id);
  }

  @authorize({
    permissions: [PermissionKey.AddPlanFeatures],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Plan Features Created',
        content: {
          'application/json': {
            schema: {
              ...getModelSchemaRefSF(FeatureValues),
            },
          },
        },
      },
    },
  })
  async setPlanFeatures(
    @param.path.string('id') id: string,
    @requestBody()
    featureValues: FeatureValues[],
  ): Promise<FeatureValues[]> {
    const values = featureValues.map(e => {
      e.strategyEntityId = id;
      e.strategyKey = 'Plan';
      return e;
    });
    return this.featureValuesRepository.createAll(values);
  }

  @authorize({
    permissions: [PermissionKey.UpdatePlanFeatures],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Plan Features Updated',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(FeatureValues),
            },
          },
        },
      },
    },
  })
  async updatePlanFeatures(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRefSF(FeatureValues, {partial: true}),
          },
        },
      },
    })
    featureValues: Partial<FeatureValues>[],
  ): Promise<FeatureValues[]> {
    return this.planFeaturesService.updatePlanFeatures(id, featureValues);
  }
}
