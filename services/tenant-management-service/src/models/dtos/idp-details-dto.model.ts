import {getJsonSchema} from '@loopback/openapi-v3';
import {AnyObject, Model, model, property} from '@loopback/repository';

@model({
  description: 'model describing payload for IDP controller',
})
export class IdpDetailsDTO extends Model {
  @property({
    type: 'object',
    description: 'Tenat object',
    jsonSchema: getJsonSchema(Object),
  })
  tenant: AnyObject;
  @property({
    type: 'object',
    description: 'plan object',
    jsonSchema: getJsonSchema(Object),
  })
  plan: AnyObject;
  constructor(data?: Partial<IdpDetailsDTO>) {
    super(data);
  }
}
