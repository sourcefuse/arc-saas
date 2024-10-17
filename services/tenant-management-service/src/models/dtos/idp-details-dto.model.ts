import { getJsonSchema } from '@loopback/openapi-v3';
import { Model, model, property } from '@loopback/repository';
import { IdpDetails, IdPKey } from '../../types';
import { TenantDto } from './tenant-dto.model';

@model({
  description: 'model describing payload for IDP controller',
})
export class IdpDetailsDTO extends Model implements IdpDetails {
  @property({
    type: 'string',
    description: 'identity provider - auth0 , keycloak , cognito',
    required: true,
    default: IdPKey.AUTH0,
    jsonSchema: {
        enum: Object.values(IdPKey),
      },
  })
  identityProvider: IdPKey;

  @property({
    type: 'object',
    description: 'address object to be created for the lead',
    jsonSchema: getJsonSchema(TenantDto),
  })
  tenant: TenantDto;

  constructor(data?: Partial<IdpDetailsDTO>) {
    super(data);
  }
}
