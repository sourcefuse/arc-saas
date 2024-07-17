import {injectable, BindingScope, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

export type TenantProvisioningHandler<T extends AnyObject = {}> = (
  body: T,
) => Promise<void>;

@injectable({scope: BindingScope.TRANSIENT})
export class TenantProvisioningHandlerProvider
  implements Provider<TenantProvisioningHandler>
{
  constructor() {}

  value() {
    return async (body: AnyObject) => this.handler(body);
  }

  private async handler(body: AnyObject): Promise<void> {
    throw Error(
      `${TenantProvisioningHandlerProvider.name} is not implemented. Follow the README for more details.`,
    );
  }
}
