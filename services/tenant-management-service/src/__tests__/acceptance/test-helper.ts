import {BindingScope, Context, CoreTags} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {MemoryStore} from 'express-rate-limit';
import {sign} from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import {TenantMgmtServiceApplication} from '../..';
import {
  ContactRepository,
  ResourceRepository,
  TenantRepository,
} from '../../repositories';
import {AWS_CODEBUILD_CLIENT, NotificationService} from '../../services';
import {Transaction} from '../fixtures';
import {MOCK_CODEBUILD_CLIENT} from '../fixtures/mock-codebuild-client';
import {DbDataSource, RedisDataSource} from '../helper/datasources';

export async function setupApplication(
  notifStub?: sinon.SinonStub,
): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });
  setUpEnv();

  const app = new TenantMgmtServiceApplication({
    rest: restConfig,
  });

  app.dataSource(DbDataSource);
  app.dataSource(RedisDataSource);

  TenantRepository.prototype.beginTransaction = async () => new Transaction();
  ContactRepository.prototype.beginTransaction = async () => new Transaction();
  ResourceRepository.prototype.beginTransaction = async () => new Transaction();

  setUpRateLimitMemory(app);
  app.bind(AWS_CODEBUILD_CLIENT).to(MOCK_CODEBUILD_CLIENT);

  await app.boot();

  if (notifStub) {
    app
      .bind('services.NotificationService')
      .to({
        send: notifStub.resolves(),
      })
      .tag({
        [CoreTags.SERVICE_INTERFACE]: NotificationService,
      })
      .inScope(BindingScope.SINGLETON);
  }
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
  process.env.LEAD_TOKEN_EXPIRY = '30000';
  process.env.LOG_LEVEL = '0';
  process.env.LEAD_KEY_LENGTH = '5';
  process.env.WEBHOOK_SECRET_EXPIRY = '30000';
  process.env.VALIDATION_TOKEN_EXPIRY = '30000';
  process.env.APP_VALIDATE_URL = 'http://localhost:4200/validate';
}

function setUpRateLimitMemory(app: RestApplication) {
  const store = new MemoryStore();
  app.bind(RateLimitSecurityBindings.DATASOURCEPROVIDER).to(store);
}

export interface AppWithClient {
  app: TenantMgmtServiceApplication;
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

export const CLIENT_IP_HEADER = '1.1.1.1';
