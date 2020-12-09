import request from 'supertest';
import app from '../app';
import server from '../apollo';
import { initPassport } from '../auth';
import db from '../db';
import seqielize from '../sequelize';
import { userRecord, validLogin } from './mock.data';

const { models } = seqielize;
let id = '';

const login = async () => {
  const response = await request(app)
    .post('/graphql')
    .set('Accept', 'application/json')
    .send({
      query: `mutation { login(email: "${validLogin.email}", password: "${validLogin.password}") { accessToken } }`,
    });

  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Object);
  expect(response.body.data.login.accessToken).toBeTruthy();

  return response.body.data.login.accessToken;
};

describe('query user', () => {
  beforeAll(async () => {
    initPassport();
    server.applyMiddleware({ app });

    await db.connect();
    const r = await models.user.create<any>(userRecord);
    id = r.id;
  });

  test('success', async () => {
    const jwt = await login();

    const response = await request(app).post('/graphql').set('Authorization', `Bearer ${jwt}`).set('Accept', 'application/json').send({
      query: 'query { user { id email } }',
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data.user.id).toEqual(id);
    expect(response.body.data.user.email).toEqual(validLogin.email);
  });

  test('without authorization header', async () => {
    const response = await request(app).post('/graphql').set('Accept', 'application/json').send({
      query: 'query { user { id email } }',
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.errors[0].message).toEqual('require login');
  });

  afterAll(async () => {
    await db.close();
  });
});
