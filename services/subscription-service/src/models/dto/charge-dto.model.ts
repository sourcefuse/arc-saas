import {Entity, model, property} from '@loopback/repository';

@model()
export class ChargeDto extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  constructor(data?: Partial<ChargeDto>) {
    super(data);
  }
}
