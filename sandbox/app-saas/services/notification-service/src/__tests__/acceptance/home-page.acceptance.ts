import {Client} from '@loopback/testlab';
import {NotificationService} from '../..';
import {setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

describe('HomePage', () => {
  let app: NotificationService;
  let client: Client;

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

  it('exposes self-hosted explorer', async () => {
    await client
      .get('/explorer/')
      .expect(STATUS_CODE.OK)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
