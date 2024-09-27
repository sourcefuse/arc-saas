import {TenantDto} from '../models/dtos/tenant-dto.model';

export enum IdPKey {
  AUTH0 = 'auth0',
  COGNITO = 'cognito',
  KEYCLOAK = 'keycloak',
}

export type ConfigureIdpFunc<T> = (payload: IdpDetails) => Promise<T>;

export interface IdpDetails {
  identityProvider: IdPKey;
  tenant: TenantDto;
}
