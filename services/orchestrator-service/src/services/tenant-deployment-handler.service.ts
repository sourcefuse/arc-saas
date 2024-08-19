import {injectable, BindingScope, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

export type TenantDeploymentHandler<T extends AnyObject = {}> = (
  body: T,
) => Promise<void>;

@injectable({scope: BindingScope.TRANSIENT})
export class TenantDeploymentHandlerProvider
  implements Provider<TenantDeploymentHandler>
{
  constructor() {}

  value() {
    return async (body: AnyObject) => this.handler(body);
  }

  private async handler(body: AnyObject): Promise<void> {
    throw Error(
      `${TenantDeploymentHandlerProvider.name} is not implemented. Follow the README for more details.`,
    );
  }
}
