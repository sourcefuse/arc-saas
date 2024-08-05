import {sign} from 'jsonwebtoken';
import {
  ApplicationConfig,
  SubscriptionServiceBindings,
  SubscriptionServiceComponent,
} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {RestApplication} from '@loopback/rest';
import {Context} from '@loopback/context';
import {AnyObject, RepositoryMixin} from '@loopback/repository';
import {
  AuthenticationBindings,
  AuthenticationComponent,
} from 'loopback4-authentication';
import {SubscriptionDataSource} from '../helpers/db.datasource';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  ServiceSequence,
} from '@sourceloop/core';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {BootMixin} from '@loopback/boot';
import path = require('path');

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});
  setUpEnv();

  const app = new TestSubscriptionServiceApplication({
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
  app: TestSubscriptionServiceApplication;
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

export class TestSubscriptionServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.bind(SubscriptionServiceBindings.Config).to({useCustomSequence: true});
    this.component(SubscriptionServiceComponent);

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
