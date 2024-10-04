import {AnyObject} from '@loopback/repository';
import {Tenant} from '../models';

export enum IdPKey {
  AUTH0 = 'auth0',
  COGNITO = 'cognito',
  KEYCLOAK = 'keycloak',
}

export type ConfigureIdpFunc<T> = (payload: IdpDetails) => Promise<T>;

export interface IdpDetails {
  tenant: AnyObject;
  plan: AnyObject;
}

export interface IdpResp {
  authId: string;
}
