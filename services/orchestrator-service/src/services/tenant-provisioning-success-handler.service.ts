import {injectable, BindingScope, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

export type TenantProvisioningSuccessHandler<T extends AnyObject = {}> = (
  body: T,
) => Promise<void>;

@injectable({scope: BindingScope.TRANSIENT})
export class TenantProvisioningSuccessHandlerProvider
  implements Provider<TenantProvisioningSuccessHandler>
{
  constructor() {}

  value() {
    return async (body: AnyObject) => this.handler(body);
  }

  private async handler(body: AnyObject): Promise<void> {
    throw Error(
      `${TenantProvisioningSuccessHandlerProvider.name} is not implemented. Follow the README for more details.`,
    );
  }
}
