import {sign} from 'jsonwebtoken';
import {SubscriptionServiceApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {RestApplication} from '@loopback/rest';
import {Context} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SubscriptionDataSource} from '../helpers/db.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});
  setUpEnv();

  const app = new SubscriptionServiceApplication({
    rest: restConfig,
  });

  app.dataSource(SubscriptionDataSource);

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

function setUpEnv() {
  process.env.NODE_ENV = 'test';
  process.env.ENABLE_TRACING = '0';
  process.env.ENABLE_OBF = '0';
  process.env.JWT_ISSUER = 'test';
  process.env.JWT_SECRET = 'test';
}

export interface AppWithClient {
  app: SubscriptionServiceApplication;
  client: Client;
}

export function getToken(permissions: string[] = []) {
  return `Bearer ${sign(
    {
      id: 'test',
      userTenantId: 'test',
      iss: process.env.JWT_ISSUER,
      permissions,
    },
    process.env.JWT_SECRET ?? '',
  )}`;
}
export async function getRepo<T>(app: RestApplication, classString: string) {
  const tempContext = new Context(app, 'test');
  tempContext.bind<AnyObject>(AuthenticationBindings.CURRENT_USER).to({
    id: 'test',
    username: 'test',
    userTenantId: 'test',
  });
  return tempContext.getSync<T>(classString);
}
