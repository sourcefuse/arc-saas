import {mockPlan, mockSubscription} from './mock-data';
import {Client, expect} from '@loopback/testlab';
import {SubscriptionServiceApplication} from '../..';
import {Subscription} from '../../models';
import {PermissionKey} from '../../permissions';
import {PlanRepository, SubscriptionRepository} from '../../repositories';

import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

const basePath = '/subscriptions';

describe('SubscriptionController', () => {
  let app: SubscriptionServiceApplication;
  let client: Client;

  let savedSubscription: Subscription;
  let subscriptionRepo: SubscriptionRepository;
  let planRepo: PlanRepository;
  const updatedSubscriberId = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    subscriptionRepo = await getRepo(
      app,
      'repositories.SubscriptionRepository',
    );
    planRepo = await getRepo(app, 'repositories.PlanRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await subscriptionRepo.deleteAllHard();
    await planRepo.deleteAllHard();
  });

  it('invokes GET /subscriptions with valid token', async () => {
    const token = getToken([PermissionKey.ViewSubscription]);
    const {body} = await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].subscriberId).to.eql(mockSubscription.subscriberId);
  });

  it('should not allow GET /subscriptions with invalid token', async () => {
    const token = getToken([PermissionKey.ViewService]);
    await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /subscriptions/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewSubscription]);
    const {body} = await client
      .get(`${basePath}/${savedSubscription.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.subscriberId).to.eql(mockSubscription.subscriberId);
  });

  it('invokes GET /subscriptions/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewSubscription]);
    const {body} = await client
      .get(`${basePath}/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PATCH /subscriptions/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateSubscription]);

    await client
      .patch(`${basePath}/${savedSubscription.id}`)
      .set('Authorization', token)
      .send({subscriberId: updatedSubscriberId})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await subscriptionRepo.findById(savedSubscription.id);
    expect(updated?.subscriberId).to.eql(updatedSubscriberId);
  });

  it('invokes PATCH /subscriptions with valid token', async () => {
    const token = getToken([PermissionKey.UpdateSubscription]);

    const {body} = await client
      .patch(`/subscriptions`)
      .set('Authorization', token)
      .send({subscriberId: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await subscriptionRepo.findById(savedSubscription.id);
    expect(updated?.subscriberId).to.eql('updated-test-all');
  });

  it('invokes DELETE /subscriptions/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeleteSubscription]);

    await client
      .delete(`${basePath}/${savedSubscription.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await subscriptionRepo.findById(savedSubscription.id);
      throw new Error('Plan not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    const plan = await planRepo.create(mockPlan);
    savedSubscription = await subscriptionRepo.create({
      ...mockSubscription,
      planId: plan.id,
    });
  }
});
