import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../permissions';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {param, get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
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
        description: 'Plan Features',
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
        description: 'Plan Features',
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
}
