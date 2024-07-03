import {Entity, model, property} from '@loopback/repository';

@model()
export class LeadToken extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  constructor(data?: Partial<LeadToken>) {
    super(data);
  }
}
