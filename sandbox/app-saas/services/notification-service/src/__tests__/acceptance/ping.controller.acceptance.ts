import {Client, expect} from '@loopback/testlab';
import {NotificationService} from '../..';
import {setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

describe('PingController', () => {
  let app: NotificationService;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(STATUS_CODE.OK);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
