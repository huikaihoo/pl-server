import request from 'supertest';

import app from '../app';
import server from '../apollo';
import { initPassport } from '../auth';
import db from '../db';
import seqielize from '../sequelize';
import { userRecord, validLogin, invalidLogin } from './mock.data';

const { models } = seqielize;
let id = '';

describe('mutation signup', () => {
  beforeAll(async () => {
    initPassport();
    server.applyMiddleware({ app });

    await db.connect();
    const r = await models.user.create<any>(userRecord);
    id = r.id;
  });

  test('success', async () => {
    const newEmail = 'new@hello.world';
    const response = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `mutation { signup(email: "${newEmail}", password: "${validLogin.password}") { id email } }`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data.signup.id).toBeTruthy();
    expect(response.body.data.signup.email).toEqual(newEmail);

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(2);

    // Check database record content
    const userFromDB: any = await models.user.findOne({
      attributes: ['id', 'email'],
      where: {
        email: newEmail,
      },
      raw: true,
    });
    expect(userFromDB).toEqual(response.body.data.signup);

    await models.user.destroy({
      where: {
        id: userFromDB.id,
      },
    });
  });

  test('duplicate email', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `mutation { signup(email: "${validLogin.email}", password: "${validLogin.password}") { id email } }`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.errors[0].message).toEqual('Validation error');

    // Check database record count
    const userCount = await models.user.count();
    expect(userCount).toEqual(1);
  });

  afterAll(async () => {
    await db.close();
  });
});
