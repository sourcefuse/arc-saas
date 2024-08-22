import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {
  param,
  get,
  getModelSchemaRef,
  post,
  requestBody,
  patch,
} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC, STATUS_CODE} from '@sourceloop/core';
import {Plan} from '../models';
import {
  Feature,
  FeatureRepository,
  FeatureValues,
  FeatureValuesRepository,
} from '@sourceloop/feature-toggle-service';
import {DataObject, repository} from '@loopback/repository';
import {PlanRepository} from '../repositories';

const basePath = 'plans/{id}/features';

export class PlanFeaturesController {
  constructor(
    @repository(PlanRepository)
    public planRepository: PlanRepository,
    @repository(FeatureValuesRepository)
    public featureValuesRepository: FeatureValuesRepository,
    @repository(FeatureRepository)
    public featureRepository: FeatureRepository,
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
              ...getModelSchemaRef(Plan),
              ...getModelSchemaRef(FeatureValues),
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
    const plan = await this.planRepository.findById(id, {
      fields: ['id', 'name', 'tier', 'size'],
    });
    const allFeatures = await this.featureRepository.find({
      fields: [
        'id',
        'key',
        'name',
        'description',
        'type',
        'defaultValue',
        'metadata',
      ],
    });

    const features: DataObject<Feature & {value: FeatureValues}>[] = [];

    const featureValuesThePlanHas = await this.featureValuesRepository.find({
      where: {
        strategyEntityId: id,
      },
      fields: [
        'id',
        'featureKey',
        'value',
        'status',
        'strategyEntityId',
        'strategyKey',
      ],
    });

    for (const featDefinition of allFeatures) {
      features.push({
        ...featDefinition,
        value: featureValuesThePlanHas.find(
          e => e.featureKey === featDefinition.id,
        ),
      });
    }

    return {
      ...plan,
      features: features,
    };
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
              ...getModelSchemaRef(FeatureValues),
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
              items: getModelSchemaRef(FeatureValues),
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
            items: getModelSchemaRef(FeatureValues, {partial: true}),
          },
        },
      },
    })
    featureValues: Partial<FeatureValues>[],
  ): Promise<FeatureValues[]> {
    const updatedFeatures: FeatureValues[] = [];

    for (const featureValue of featureValues) {
      if (!featureValue.id) {
        throw new Error('Feature value ID is required for update');
      }

      // Ensure the feature value belongs to the specified plan
      const existingFeatureValue = await this.featureValuesRepository.findOne({
        where: {
          id: featureValue.id,
          strategyEntityId: id,
          strategyKey: 'Plan',
        },
      });

      if (!existingFeatureValue) {
        throw new Error(
          `Feature value with ID ${featureValue.id} not found for this plan`,
        );
      }

      // Update the feature value
      await this.featureValuesRepository.updateById(
        featureValue.id,
        featureValue,
      );

      // Fetch the updated feature value
      const updatedFeatureValue = await this.featureValuesRepository.findById(
        featureValue.id,
      );
      updatedFeatures.push(updatedFeatureValue);
    }

    return updatedFeatures;
  }
}
