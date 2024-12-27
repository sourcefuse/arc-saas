import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {CONTENT_TYPE} from '@sourceloop/core';

const tokenKey = '{token}';
const config = {
  name: 'TenantMgmtService',
  connector: 'rest',
  baseURL: '',
  crud: false,
  options: {
    baseUrl: process.env.TENANT_MGMT_URL as string,
    headers: {
      accept: CONTENT_TYPE.JSON,
      ['content-type']: CONTENT_TYPE.JSON,
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: '/invoices',
        headers: {
          Authorization: tokenKey,
        },
        body: '{body}',
      },
      functions: {
        createInvoice: ['token', 'body'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/leads',
        body: '{body}',
        headers: {
          ['content-type']: CONTENT_TYPE.JSON,
        },
      },
      functions: {
        createLead: ['body'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/leads/{id}/verify',
        headers: {
          ['content-type']: CONTENT_TYPE.JSON,
          Authorization: tokenKey,
        },
      },
      functions: {
        verifyLead: ['token', 'id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/tenants',
        headers: {
          Authorization: tokenKey,
        },
        body: '{body}',
      },
      functions: {
        createTenant: ['token', 'body'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/leads/{id}/tenants',
        headers: {
          Authorization: tokenKey,
        },
        body: '{body}',
      },
      functions: {
        createTenantFromLead: ['token', 'id', 'body'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/tenants/{id}/provision',
        headers: {
          Authorization: tokenKey,
        },
        body: '{body}',
      },
      functions: {
        provisionTenant: ['token', 'id', 'body'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '/leads',
        headers: {
          Authorization: tokenKey,
        },
        query: {
          filter: '{filter}',
        },
      },
      functions: {
        getLeads: ['token', 'filter'],
      },
    },

    {
      template: {
        method: 'GET',
        url: '/tenants',
        headers: {
          Authorization: tokenKey,
        },
        query: {
          filter: '{filter}',
        },
      },
      functions: {
        getTenants: ['token', 'filter'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TenantMgmtServiceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static readonly dataSourceName = 'TenantMgmtService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.TenantMgmtService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
