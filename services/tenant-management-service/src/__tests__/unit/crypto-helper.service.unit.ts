import {expect} from '@loopback/testlab';
import {verify} from 'jsonwebtoken';
import {Lead, Tenant} from '../../models';
import {CryptoHelperService} from '../../services';
import {LeadUser} from '../../types';
import {setupApplication} from '../acceptance/test-helper';
import {TenantMgmtServiceApplication} from '../../application';

describe('CryptoHelperService', () => {
  let app: TenantMgmtServiceApplication;
  let cryptoHelperService: CryptoHelperService;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });
  beforeEach(() => {
    cryptoHelperService = new CryptoHelperService();
  });
  it('should generate a temporary token for a lead', () => {
    const lead = new Lead({id: 'leadId'});
    const permissions = ['permission1', 'permission2'];

    const result = cryptoHelperService.generateTempTokenForLead(
      lead,
      permissions,
    );

    expect(result).to.be.String();

    const contents = verify(result, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
    }) as LeadUser & {permissions: string[]};

    expect(contents).to.have.properties('id', 'userTenantId', 'permissions');
    expect(contents.id).to.equal(lead.id);
    expect(contents.userTenantId).to.equal(lead.id);
    expect(contents.permissions).to.deepEqual(permissions);
  });

  it('should generate a temporary token for a lead with default permissions', () => {
    const lead = new Lead({id: 'leadId'});

    const result = cryptoHelperService.generateTempTokenForLead(lead);

    expect(result).to.be.String();

    const contents = verify(result, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
    }) as LeadUser & {permissions: string[]};

    expect(contents).to.have.properties('id', 'userTenantId', 'permissions');
    expect(contents.id).to.equal(lead.id);
    expect(contents.userTenantId).to.equal(lead.id);
    expect(contents.permissions).to.deepEqual([]);
  });

  it('should generate a temporary token for a tenant with default permissions', () => {
    const tenant = new Tenant({id: 'leadId'});

    const result = cryptoHelperService.generateTempTokenForTenant(tenant);

    expect(result).to.be.String();

    const contents = verify(result, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER,
    }) as LeadUser & {permissions: string[]};

    expect(contents).to.have.properties('id', 'userTenantId', 'permissions');
    expect(contents.id).to.equal(tenant.id);
    expect(contents.userTenantId).to.equal(tenant.id);
    expect(contents.permissions).to.deepEqual([]);
  });
});
