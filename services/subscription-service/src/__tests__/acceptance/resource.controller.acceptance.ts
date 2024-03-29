import {mockResource} from './mock-data';
import {Client, expect} from '@loopback/testlab';
import {SubscriptionServiceApplication} from '../..';
import {Resource} from '../../models';
import {PermissionKey} from '../../permissions';
import {ResourceRepository} from '../../repositories';

import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

const basePath = '/resources';

describe('ResourceController', () => {
  let app: SubscriptionServiceApplication;
  let client: Client;

  let savedResource: Resource;
  let resourceRepo: ResourceRepository;
  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    resourceRepo = await getRepo(app, 'repositories.ResourceRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await resourceRepo.deleteAllHard();
  });

  it('invokes POST /resources with valid token', async () => {
    const token = getToken([PermissionKey.CreateResource]);
    const {body} = await client
      .post(basePath)
      .set('Authorization', token)
      .send({...mockResource, name: 'test2'})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.name).to.eql('test2');
  });

  it('invokes GET /resources with valid token', async () => {
    const token = getToken([PermissionKey.ViewResource]);
    const {body} = await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].name).to.eql(mockResource.name);
  });

  it('should not allow GET /resources with invalid token', async () => {
    const token = getToken([PermissionKey.ViewSubscription]);
    await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /resources/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewResource]);
    const {body} = await client
      .get(`${basePath}/${savedResource.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.name).to.eql(mockResource.name);
  });

  it('invokes GET /resources/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewResource]);
    const {body} = await client
      .get(`${basePath}/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /resources/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateResource]);

    await client
      .put(`${basePath}/${savedResource.id}`)
      .set('Authorization', token)
      .send({...savedResource, name: updatedName, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await resourceRepo.findById(savedResource.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /resources/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateResource]);

    await client
      .patch(`${basePath}/${savedResource.id}`)
      .set('Authorization', token)
      .send({name: updatedName})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await resourceRepo.findById(savedResource.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /resources with valid token', async () => {
    const token = getToken([PermissionKey.UpdateResource]);

    const {body} = await client
      .patch(`${basePath}`)
      .set('Authorization', token)
      .send({name: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await resourceRepo.findById(savedResource.id);
    expect(updated?.name).to.eql('updated-test-all');
  });

  it('invokes DELETE /resources/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeleteResource]);

    await client
      .delete(`${basePath}/${savedResource.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await resourceRepo.findById(savedResource.id);
      throw new Error('Resource not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    savedResource = await resourceRepo.create(mockResource);
  }
});
