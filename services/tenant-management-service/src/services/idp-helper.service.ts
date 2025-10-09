import {injectable, inject, BindingScope} from '@loopback/core';
import {TenantManagementServiceBindings} from '../keys';
import {IdpDetailsDTO} from '../models/dtos/idp-details-dto.model';
import {ConfigureIdpFunc, IdPKey, IdpResp} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class IdpHelperService {
  constructor(
    @inject(TenantManagementServiceBindings.IDP_KEYCLOAK)
    private readonly idpKeycloakProvider: ConfigureIdpFunc<IdpResp>,
    @inject(TenantManagementServiceBindings.IDP_AUTH0)
    private readonly idpAuth0Provider: ConfigureIdpFunc<IdpResp>,
  ) {}

  async configureIdp(payload: IdpDetailsDTO): Promise<IdpResp> {
    let res: IdpResp = {authId: ''};

    switch (payload.tenant.identityProvider) {
      case IdPKey.AUTH0:
        res = await this.idpAuth0Provider(payload);
        break;
      case IdPKey.KEYCLOAK:
        res = await this.idpKeycloakProvider(payload);
        break;
      case IdPKey.COGNITO:
        break;
      default:
        break;
    }

    return res;
  }
}
