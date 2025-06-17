import {
  Client,
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {TenantMgmtFacadeApplication} from '../..';
import {getToken, setupApplication} from './test-helper';
import {TenantHelperService} from '../../services';
import {Tenant} from '../../models';
import {buildCreateTenantDto, buildTenant} from '../mock-data';
import {PermissionKey} from '../../permissions';
import {BindingScope, CoreTags} from '@loopback/core';
import {STATUS_CODE} from '@sourceloop/core';

describe('TenantController', () => {
  const basePath = '/tenants';
  let app: TenantMgmtFacadeApplication;
  let tenantHelperStub: StubbedInstanceWithSinonAccessor<TenantHelperService>;
  let mockTenant: Tenant;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(() => {
    tenantHelperStub = createStubInstance(TenantHelperService);
    mockTenant = buildTenant();
    tenantHelperStub.stubs.createTenant.resolves(mockTenant);
    app
      .bind('services.TenantHelperService')
      .to(tenantHelperStub)
      .tag({
        [CoreTags.SERVICE_INTERFACE]: TenantHelperService,
      })
      .inScope(BindingScope.SINGLETON);
  });

  it('should create tenant for a a payload with a valid token', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    const {body: tenant} = await client
      .post(basePath)
      .set('Authorization', token)
      .send(buildCreateTenantDto())
      .expect(STATUS_CODE.OK);
    expect(tenant.id).to.eql(mockTenant.id);
  });

  it('should throw 403 if token is invalid', async () => {
    const token = getToken([PermissionKey.ViewTenant]);
    await client
      .post(basePath)
      .set('Authorization', token)
      .send(buildCreateTenantDto())
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('should throw 422 if domain is of invalid format', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    await client
      .post(basePath)
      .set('Authorization', token)
      .send({
        ...buildCreateTenantDto(),
        domain: ['some-domain'],
      })
      .expect(STATUS_CODE.UNPROCESSED_ENTITY);
  });

  it('should throw 422 if key is of invalid format', async () => {
    const token = getToken([PermissionKey.CreateTenant]);
    await client
      .post(basePath)
      .set('Authorization', token)
      .send({
        ...buildCreateTenantDto(),
        key: 'some-key-with-hyphen',
      })
      .expect(STATUS_CODE.UNPROCESSED_ENTITY);
  });
});
