import {injectable, BindingScope, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

export type TenantDeprovisioningHandler<T extends AnyObject = {}> = (
  body: T,
) => Promise<void>;

@injectable({scope: BindingScope.TRANSIENT})
export class TenantDeprovisioningHandlerProvider
  implements Provider<TenantDeprovisioningHandler>
{
  constructor() {}

  value() {
    return async (body: AnyObject) => this.handler(body);
  }

  private async handler(body: AnyObject): Promise<void> {
    throw Error(
      `${TenantDeprovisioningHandlerProvider.name} is not implemented. Follow the README for more details.`,
    );
  }
}
