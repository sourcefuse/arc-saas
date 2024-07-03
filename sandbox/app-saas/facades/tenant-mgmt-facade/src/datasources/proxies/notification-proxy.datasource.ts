import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {CONTENT_TYPE} from '@sourceloop/core';

const config = {
  name: 'NotificationService',
  connector: 'rest',
  baseURL: '',
  crud: false,
  options: {
    baseUrl: process.env.NOTIFICATION_SERVICE_URL as string,
    headers: {
      accept: CONTENT_TYPE.JSON,
      ['content-type']: CONTENT_TYPE.JSON,
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: '/notification-templates/{eventName}/{notificationType}',
        headers: {
          // need to add Bearer here as we are adding token ourselves
          // in case token is coming form front end no need to add.
          Authorization: 'Bearer {token}',
        },
      },
      functions: {
        getTemplateByName: ['eventName', 'notificationType', 'token'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/notifications',
        headers: {
          Authorization: 'Bearer {token}',
        },
        body: '{body}',
      },
      functions: {
        createNotification: ['token', 'body'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class NotificationServiceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static readonly dataSourceName = 'NotificationService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.NotificationService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
