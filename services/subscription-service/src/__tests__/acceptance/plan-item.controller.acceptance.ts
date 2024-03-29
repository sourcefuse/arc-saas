import {mockPlanItem} from './mock-data';
import {Client, expect} from '@loopback/testlab';
import {SubscriptionServiceApplication} from '../..';
import {PlanItem} from '../../models';
import {PermissionKey} from '../../permissions';
import {PlanItemRepository} from '../../repositories';

import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

const basePath = '/plan-items';

describe('PlanItemController', () => {
  let app: SubscriptionServiceApplication;
  let client: Client;

  let savedPlanItem: PlanItem;
  let planItemRepo: PlanItemRepository;
  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    planItemRepo = await getRepo(app, 'repositories.PlanItemRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await planItemRepo.deleteAllHard();
  });

  it('invokes POST /plan-items with valid token', async () => {
    const token = getToken([PermissionKey.CreatePlanItem]);
    const {body} = await client
      .post(basePath)
      .set('Authorization', token)
      .send({...mockPlanItem, name: 'test2'})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.name).to.eql('test2');
  });

  it('invokes GET /plan-items with valid token', async () => {
    const token = getToken([PermissionKey.ViewPlanItem]);
    const {body} = await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].name).to.eql(mockPlanItem.name);
  });

  it('should not allow GET /plan-items with invalid token', async () => {
    const token = getToken([PermissionKey.ViewSubscription]);
    await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /plan-items/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewPlanItem]);
    const {body} = await client
      .get(`${basePath}/${savedPlanItem.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.name).to.eql(mockPlanItem.name);
  });

  it('invokes GET /plan-items/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewPlanItem]);
    const {body} = await client
      .get(`${basePath}/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /plan-items/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdatePlanItem]);

    await client
      .put(`${basePath}/${savedPlanItem.id}`)
      .set('Authorization', token)
      .send({...savedPlanItem, name: updatedName, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await planItemRepo.findById(savedPlanItem.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /plan-items/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdatePlanItem]);

    await client
      .patch(`${basePath}/${savedPlanItem.id}`)
      .set('Authorization', token)
      .send({name: updatedName})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await planItemRepo.findById(savedPlanItem.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /plan-items with valid token', async () => {
    const token = getToken([PermissionKey.UpdatePlanItem]);

    const {body} = await client
      .patch(`${basePath}`)
      .set('Authorization', token)
      .send({name: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await planItemRepo.findById(savedPlanItem.id);
    expect(updated?.name).to.eql('updated-test-all');
  });

  it('invokes DELETE /plan-items/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeletePlanItem]);

    await client
      .delete(`${basePath}/${savedPlanItem.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await planItemRepo.findById(savedPlanItem.id);
      throw new Error('Plan not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    savedPlanItem = await planItemRepo.create(mockPlanItem);
  }
});
