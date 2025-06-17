import {inject, JSONObject, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {getService} from '@loopback/service-proxy';
import {NotificationServiceDataSource} from '../../datasources';

export interface NotificationProxyService {
  getTemplateByName(
    eventName: string,
    notificationType: number,
    token: string,
  ): Promise<AnyObject>;

  createNotification(token: string, body: object): Promise<JSONObject>;
}

export class NotificationProxyServiceProvider
  implements Provider<NotificationProxyService>
{
  constructor(
    @inject('datasources.NotificationService')
    protected dataSource: NotificationServiceDataSource,
  ) {}

  value(): Promise<NotificationProxyService> {
    return getService(this.dataSource);
  }
}
