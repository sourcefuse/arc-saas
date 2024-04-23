import {Model, model, property} from '@loopback/repository';
import {IPlanItem, IValue} from '../../types';

@model({
  description: 'model describing plan items',
})
export class PlanItemDTO extends Model implements IPlanItem {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    description: 'name of the plan item',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    name: 'plan_item_type',
    description: 'type of the plan item',
  })
  planItemType: string;

  @property({
    type: 'object',
    required: true,
    description: 'value of the plan item',
  })
  value: IValue;

  constructor(data?: Partial<PlanItemDTO>) {
    super(data);
  }
}
