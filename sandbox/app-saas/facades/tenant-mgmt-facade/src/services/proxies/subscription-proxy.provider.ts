import {Provider, inject} from '@loopback/core';
import {
  IPlan,
  ISubscription,
  SubscriptionCreationType,
  SubscriptionUpdationType,
} from './types';
import {getService} from '@loopback/service-proxy';
import {Filter} from '@loopback/repository';
import {SubscriptionServiceDataSource} from '../../datasources';

export interface SubscriptionProxyService {
  findById(
    token: string,
    id: string,
    filter?: Filter<ISubscription> | string,
  ): Promise<ISubscription>;
  create(token: string, body: SubscriptionCreationType): Promise<ISubscription>;
  updateById(
    token: string,
    id: string,
    partialSubscription: SubscriptionUpdationType,
  ): Promise<ISubscription>;
  findPlanById(
    token: string,
    id: string,
    filter?: Filter<IPlan>,
  ): Promise<IPlan>;
  find(
    token: string,
    filter?: Filter<ISubscription> | string,
  ): Promise<ISubscription[]>;
  findById(
    token:string,
    id: string,
    filter?: Filter<ISubscription> | string,
  ):Promise<ISubscription>;
  expireSoonSubscription(
    token: string,
    filter?: Filter<ISubscription> | string,):Promise<{ id: string, daysRemainingToExpiry: number, subscriberId: string }[]>;
  expiredSubscription(
    token: string,
    days:number,
    filter?: Filter<ISubscription> | string,
  ) :Promise<{ subscriptionId: string; subscriberId: string; }[]>
}

export class SubscriptionProxyServiceProvider
  implements Provider<SubscriptionProxyService>
{
  constructor(
    @inject('datasources.SubscriptionService')
    protected dataSource: SubscriptionServiceDataSource,
  ) {}
  value(): Promise<SubscriptionProxyService> {
    return getService(this.dataSource);
  }
}
