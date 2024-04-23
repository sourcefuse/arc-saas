import {Entity, model, property} from '@loopback/repository';

@model()
export class WebhookSecret extends Entity {
  @property({
    type: 'string',
    required: true,
    description:
      'the secret key value used to generate and validate an hmac signature',
  })
  secret: string;

  @property({
    type: 'string',
    required: true,
    description:
      'any other information that is used combined with the payload to generate the hmac',
  })
  context: string;

  constructor(data?: Partial<WebhookSecret>) {
    super(data);
  }
}
