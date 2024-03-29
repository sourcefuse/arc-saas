import {mockPlan} from './mock-data';
import {Client, expect} from '@loopback/testlab';
import {SubscriptionServiceApplication} from '../..';
import {Plan} from '../../models';
import {PermissionKey} from '../../permissions';
import {PlanRepository} from '../../repositories';
import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

const basePath = '/plans';

describe('PlanController', () => {
  let app: SubscriptionServiceApplication;
  let client: Client;

  let savedPlan: Plan;
  let planRepo: PlanRepository;
  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    planRepo = await getRepo(app, 'repositories.PlanRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await planRepo.deleteAllHard();
  });

  it('invokes POST /plans with valid token', async () => {
    const token = getToken([PermissionKey.CreatePlan]);
    const {body} = await client
      .post(basePath)
      .set('Authorization', token)
      .send({...mockPlan, name: 'test2'})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.name).to.eql('test2');
  });

  it('invokes GET /plans with valid token', async () => {
    const token = getToken([PermissionKey.ViewPlan]);
    const {body} = await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].name).to.eql(mockPlan.name);
  });

  it('should not allow GET /plans with invalid token', async () => {
    const token = getToken([PermissionKey.ViewSubscription]);
    await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /plans/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewPlan]);
    const {body} = await client
      .get(`${basePath}/${savedPlan.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.name).to.eql(mockPlan.name);
  });

  it('invokes GET /plans/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewPlan]);
    const {body} = await client
      .get(`${basePath}/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /plans/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdatePlan]);

    await client
      .put(`${basePath}/${savedPlan.id}`)
      .set('Authorization', token)
      .send({...savedPlan, name: updatedName, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await planRepo.findById(savedPlan.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /plans/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdatePlan]);

    await client
      .patch(`${basePath}/${savedPlan.id}`)
      .set('Authorization', token)
      .send({name: updatedName})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await planRepo.findById(savedPlan.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /plans with valid token', async () => {
    const token = getToken([PermissionKey.UpdatePlan]);

    const {body} = await client
      .patch(`${basePath}`)
      .set('Authorization', token)
      .send({name: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await planRepo.findById(savedPlan.id);
    expect(updated?.name).to.eql('updated-test-all');
  });

  it('invokes DELETE /plans/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeletePlan]);

    await client
      .delete(`${basePath}/${savedPlan.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await planRepo.findById(savedPlan.id);
      throw new Error('Plan not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    savedPlan = await planRepo.create(mockPlan);
  }
});
