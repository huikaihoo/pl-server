import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../app';
import server from '../apollo';
import { initPassport } from '../auth';
import db from '../db';
import seqielize from '../sequelize';
import { userRecord, validLogin, invalidLogin } from './mock.data';

const { models } = seqielize;
let id = '';

describe('mutation login', () => {
  beforeAll(async () => {
    initPassport();
    server.applyMiddleware({ app });

    await db.connect();
    const r = await models.user.create<any>(userRecord);
    id = r.id;
  });

  test('success', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `mutation { login(email: "${validLogin.email}", password: "${validLogin.password}") { accessToken } }`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data.login.accessToken).toBeTruthy();

    // Check payload of accessToken
    const jwtPayload: any = jwt.decode(response.body.data.login.accessToken);
    expect(jwtPayload.id).toEqual(id);
  });

  test('invalid email', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `mutation { login(email: "${invalidLogin.email}", password: "${validLogin.password}") { accessToken } }`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.errors[0].message).toEqual('incorrect login credentials');
  });

  test('invalid password', async () => {
    const response = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `mutation { login(email: "${validLogin.email}", password: "${invalidLogin.password}") { accessToken } }`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.errors[0].message).toEqual('incorrect login credentials');
  });

  afterAll(async () => {
    await db.close();
  });
});
