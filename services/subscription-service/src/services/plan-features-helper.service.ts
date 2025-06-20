import {BindingScope, injectable} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {
  Feature,
  FeatureRepository,
  FeatureValues,
  FeatureValuesRepository,
} from '@sourceloop/feature-toggle-service';
import {PlanRepository} from '../repositories';
@injectable({scope: BindingScope.TRANSIENT})
export class PlanFeaturesService {
  constructor(
    @repository(PlanRepository)
    private readonly planRepository: PlanRepository,
    @repository(FeatureValuesRepository)
    private readonly featureValuesRepository: FeatureValuesRepository,
    @repository(FeatureRepository)
    public featureRepository: FeatureRepository,
  ) {}

  async planFeatures(id: string) {
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

  async updatePlanFeatures(
    id: string,
    featureValues: Partial<FeatureValues>[],
  ) {
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
