import {Model, model, property} from '@loopback/repository';

@model()
export class VerifyLeadResponseDTO extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  constructor(data?: Partial<VerifyLeadResponseDTO>) {
    super(data);
  }
}
