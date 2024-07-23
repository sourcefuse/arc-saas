import {
  injectable,
  BindingScope,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

export type TierDetailsFn = (tier: string) => ValueOrPromise<AnyObject>;

@injectable({scope: BindingScope.TRANSIENT})
export class TierDetailsProvider implements Provider<TierDetailsFn> {
  constructor() {}

  value() {
    return async (tier: string) => this.fetchTierDetails(tier);
  }

  private fetchTierDetails(tier: string) {
    // Example implementation
    // To write your own logic, bind your custom provider of fetchign tier details.
    // Follow readme for more details.
    return Promise.resolve({
      jobIdentifier: `${tier}-job`,
    });
  }
}
