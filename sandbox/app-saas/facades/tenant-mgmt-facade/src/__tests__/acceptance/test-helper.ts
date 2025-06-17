import {TenantMgmtFacadeApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {AuthCacheSourceName} from '@sourceloop/core';
import {sign} from 'jsonwebtoken';
import {RateLimitSecurityBindings} from 'loopback4-ratelimiter';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });
  setUpEnv();

  const app = new TenantMgmtFacadeApplication({
    rest: restConfig,
  });

  app.bind(`datasources.config.${AuthCacheSourceName}`).to({
    name: AuthCacheSourceName,
    connector: 'kv-memory',
  });

  app.bind(RateLimitSecurityBindings.RATELIMIT_SECURITY_ACTION).to(async () => {
    /* nothing here */
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

function setUpEnv() {
  process.env.NODE_ENV = 'test';
  process.env.ENABLE_TRACING = '0';
  process.env.ENABLE_OBF = '0';
  process.env.REDIS_NAME = 'redis';
  process.env.LOG_LEVEL = '0';
  process.env.JWT_ISSUER = 'test';
  process.env.JWT_SECRET = 'test';
}

export interface AppWithClient {
  app: TenantMgmtFacadeApplication;
  client: Client;
}

export function getToken(permissions: string[] = [], withoutBearer = false) {
  return `${withoutBearer ? '' : 'Bearer '}${sign(
    {
      id: 'test',
      userTenantId: 'test',
      iss: process.env.JWT_ISSUER,
      permissions,
    },
    process.env.JWT_SECRET ?? '',
  )}`;
}
