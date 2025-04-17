import {
  ApplicationConfig,
  BindingScope,
  Context,
  CoreTags,
} from '@loopback/core';
import {AnyObject, RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {MemoryStore} from 'express-rate-limit';
import {sign} from 'jsonwebtoken';
import {
  AuthenticationBindings,
  AuthenticationComponent,
} from 'loopback4-authentication';
import {RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import {
  // EventConnectorBinding,
  TenantManagementServiceBindings,
  TenantManagementServiceComponent,
  WebhookTenantManagementServiceComponent,
} from '../..';
import {
  ContactRepository,
  ResourceRepository,
  TenantRepository,
} from '../../repositories';
import {NotificationService} from '../../services';
import {Transaction} from '../fixtures';
import {DbDataSource, RedisDataSource} from '../helper/datasources';
import {IEventConnector} from '../../types/i-event-connector.interface';
import {BootMixin} from '@loopback/boot';
import path from 'path';
import {
  ServiceSequence,
  BearerVerifierBindings,
  BearerVerifierType,
  BearerVerifierConfig,
  BearerVerifierComponent,
} from '@sourceloop/core';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';

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

  const app = new TestTenantMgmtServiceApplication({
    rest: restConfig,
  });
  app.sequence(ServiceSequence);

  // Mount authentication component for default sequence
  app.component(AuthenticationComponent);
  // Mount bearer verifier component
  app.bind(BearerVerifierBindings.Config).to({
    authServiceUrl: '',
    type: BearerVerifierType.service,
    useSymmetricEncryption: true,
  } as BearerVerifierConfig);
  app.component(BearerVerifierComponent);

  // Mount authorization component for default sequence
  app.bind(AuthorizationBindings.CONFIG).to({
    allowAlwaysPaths: ['/explorer'],
  });
  app.component(AuthorizationComponent);

  app.dataSource(DbDataSource);
  app.dataSource(RedisDataSource);

  TenantRepository.prototype.beginTransaction = async () => new Transaction();
  ContactRepository.prototype.beginTransaction = async () => new Transaction();
  ResourceRepository.prototype.beginTransaction = async () => new Transaction();

  setUpRateLimitMemory(app);
  setupEventConnector(app);

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

function setupEventConnector(app: RestApplication) {
  class EventConnector implements IEventConnector<unknown> {
    publish(event: unknown): Promise<void> {
      return Promise.resolve();
    }
  }

  app.bind(TenantManagementServiceBindings.EventConnectorBinding).toClass(EventConnector);
}

export interface AppWithClient {
  app: TestTenantMgmtServiceApplication;
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

export class TestTenantMgmtServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(TenantManagementServiceBindings.config).to({
      useCustomSequence: true,
    });
    this.component(TenantManagementServiceComponent);
    this.component(WebhookTenantManagementServiceComponent);
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
