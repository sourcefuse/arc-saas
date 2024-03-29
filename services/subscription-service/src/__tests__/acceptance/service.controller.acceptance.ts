import {mockService} from './mock-data';
import {Client, expect} from '@loopback/testlab';
import {SubscriptionServiceApplication} from '../..';
import {Service} from '../../models';
import {PermissionKey} from '../../permissions';
import {ServiceRepository} from '../../repositories';

import {getRepo, getToken, setupApplication} from './test-helper';
import {STATUS_CODE} from '@sourceloop/core';

const basePath = '/services';

describe('ServiceController', () => {
  let app: SubscriptionServiceApplication;
  let client: Client;

  let savedService: Service;
  let serviceRepo: ServiceRepository;
  const updatedName = 'updated-test';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    serviceRepo = await getRepo(app, 'repositories.ServiceRepository');
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async () => {
    await seedData();
  });

  afterEach(async () => {
    await serviceRepo.deleteAllHard();
  });

  it('invokes POST /services with valid token', async () => {
    const token = getToken([PermissionKey.CreateService]);
    const {body} = await client
      .post(basePath)
      .set('Authorization', token)
      .send({...mockService, name: 'test2'})
      .expect(STATUS_CODE.OK);
    expect(body.id).to.be.String();
    expect(body.name).to.eql('test2');
  });

  it('invokes GET /services with valid token', async () => {
    const token = getToken([PermissionKey.ViewService]);
    const {body} = await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.length).to.eql(1);
    expect(body[0].name).to.eql(mockService.name);
  });

  it('should not allow GET /services with invalid token', async () => {
    const token = getToken([PermissionKey.ViewResource]);
    await client
      .get(basePath)
      .set('Authorization', token)
      .expect(STATUS_CODE.FORBIDDEN);
  });

  it('invokes GET /services/{id} with valid token', async () => {
    const token = getToken([PermissionKey.ViewService]);
    const {body} = await client
      .get(`${basePath}/${savedService.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.name).to.eql(mockService.name);
  });

  it('invokes GET /services/count with valid token', async () => {
    const token = getToken([PermissionKey.ViewService]);
    const {body} = await client
      .get(`${basePath}/count`)
      .set('Authorization', token)
      .expect(STATUS_CODE.OK);
    expect(body.count).to.eql(1);
  });

  it('invokes PUT /services/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateService]);

    await client
      .put(`${basePath}/${savedService.id}`)
      .set('Authorization', token)
      .send({...savedService, name: updatedName, id: undefined})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await serviceRepo.findById(savedService.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /services/{id} with valid token', async () => {
    const token = getToken([PermissionKey.UpdateService]);

    await client
      .patch(`${basePath}/${savedService.id}`)
      .set('Authorization', token)
      .send({name: updatedName})
      .expect(STATUS_CODE.NO_CONTENT);

    const updated = await serviceRepo.findById(savedService.id);
    expect(updated?.name).to.eql(updatedName);
  });

  it('invokes PATCH /services with valid token', async () => {
    const token = getToken([PermissionKey.UpdateService]);

    const {body} = await client
      .patch(`/services`)
      .set('Authorization', token)
      .send({name: 'updated-test-all'})
      .expect(STATUS_CODE.OK);

    expect(body.count).to.eql(1);
    const updated = await serviceRepo.findById(savedService.id);
    expect(updated?.name).to.eql('updated-test-all');
  });

  it('invokes DELETE /services/{id} with valid token', async () => {
    const token = getToken([PermissionKey.DeleteService]);

    await client
      .delete(`${basePath}/${savedService.id}`)
      .set('Authorization', token)
      .expect(STATUS_CODE.NO_CONTENT);

    try {
      await serviceRepo.findById(savedService.id);
      throw new Error('Service not deleted');
    } catch (err) {
      expect(err.status).to.eql(STATUS_CODE.NOT_FOUND);
    }
  });

  async function seedData() {
    savedService = await serviceRepo.create(mockService);
  }
});
