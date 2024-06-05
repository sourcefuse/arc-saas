import {Model, model, property} from '@loopback/repository';
import {PlanTier} from '../../enums';

@model()
export class TenantTierDTO extends Model {
  @property({
    type: 'string',
    required: true,
  })
  tier: PlanTier;

  constructor(data?: Partial<TenantTierDTO>) {
    super(data);
  }
}
