import {Model, model, property} from '@loopback/repository';
import {WebhookPayload} from '../../types';

@model()
export class WebhookDTO<T extends WebhookPayload['data']> extends Model {
  @property({
    type: 'string',
    required: true,
  })
  initiatorId: string;

  @property({
    type: 'object',
    required: true,
  })
  data: T;

  @property({
    type: 'number',
    required: true,
  })
  type: number;

  constructor(data?: Partial<WebhookDTO<T>>) {
    super(data);
  }
}
