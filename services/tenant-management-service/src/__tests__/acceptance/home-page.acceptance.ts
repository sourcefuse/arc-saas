import {Client} from '@loopback/testlab';
import {STATUS_CODE} from '@sourceloop/core';
import {TenantMgmtServiceApplication} from '../..';
import {setupApplication} from './test-helper';

describe('HomePage', () => {
  let app: TenantMgmtServiceApplication;
  let client: Client;

  describe('Without base path', () => {
    before('setupApplication', async () => {
      ({app, client} = await setupApplication());
    });

    after(async () => {
      await app.stop();
    });

    it('exposes a default home page', async () => {
      await client
        .get('/')
        .expect(STATUS_CODE.OK)
        .expect('Content-Type', /text\/html/);
    });
  });
});
