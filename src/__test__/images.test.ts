import request from 'supertest';

import app from '../app';
import server from '../apollo';
import { initPassport } from '../auth';
import db from '../db';
import seqielize from '../sequelize';
import redis from '../redis';
import { userRecord, validLogin, generateImages } from './mock.data';

jest.mock('../api/pixabay');
jest.mock('../api/storyblocks');
jest.mock('../api/unsplash');

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

describe('query images', () => {
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
      query: `query { images(keyword: "cat") { image_ID thumbnails preview title source tags } }`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Array.isArray(response.body.data.images)).toBe(true);
    expect(response.body.data.images.length).toEqual(12);

    await redis.del('cat_Pixabay');
    await redis.del('cat_Storyblocks');
    await redis.del('cat_Unsplash');
  });

  test('success [no return from pixabay]', async () => {
    const jwt = await login();

    const response = await request(app).post('/graphql').set('Authorization', `Bearer ${jwt}`).set('Accept', 'application/json').send({
      query: `query { images(keyword: "empty-Pixabay") { image_ID thumbnails preview title source tags } }`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Array.isArray(response.body.data.images)).toBe(true);
    expect(response.body.data.images.length).toEqual(9);

    await redis.del('empty-Pixabay_Pixabay');
    await redis.del('empty-Pixabay_Storyblocks');
    await redis.del('empty-Pixabay_Unsplash');
  });

  test('success [no return from storyblocks]', async () => {
    const jwt = await login();

    const response = await request(app).post('/graphql').set('Authorization', `Bearer ${jwt}`).set('Accept', 'application/json').send({
      query: `query { images(keyword: "empty-Storyblocks") { image_ID thumbnails preview title source tags } }`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Array.isArray(response.body.data.images)).toBe(true);
    expect(response.body.data.images.length).toEqual(8);

    await redis.del('empty-Storyblocks_Pixabay');
    await redis.del('empty-Storyblocks_Storyblocks');
    await redis.del('empty-Storyblocks_Unsplash');
  });

  test('success [no return from unsplash]', async () => {
    const jwt = await login();

    const response = await request(app).post('/graphql').set('Authorization', `Bearer ${jwt}`).set('Accept', 'application/json').send({
      query: `query { images(keyword: "empty-Unsplash") { image_ID thumbnails preview title source tags } }`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Array.isArray(response.body.data.images)).toBe(true);
    expect(response.body.data.images.length).toEqual(7);

    await redis.del('empty-Unsplash_Pixabay');
    await redis.del('empty-Unsplash_Storyblocks');
    await redis.del('empty-Unsplash_Unsplash');
  });

  test('success [return from cache]', async () => {
    await redis.set('dog_Pixabay', JSON.stringify(generateImages(2, 'Pixabay', 'dog')));
    await redis.set('dog_Storyblocks', JSON.stringify(generateImages(2, 'Storyblocks', 'dog')));
    await redis.set('dog_Unsplash', JSON.stringify(generateImages(2, 'Unsplash', 'dog')));

    const jwt = await login();

    const response = await request(app).post('/graphql').set('Authorization', `Bearer ${jwt}`).set('Accept', 'application/json').send({
      query: `query { images(keyword: "dog") { image_ID thumbnails preview title source tags } }`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(Array.isArray(response.body.data.images)).toBe(true);
    expect(response.body.data.images.length).toEqual(6);

    await redis.del('dog_Pixabay');
    await redis.del('dog_Storyblocks');
    await redis.del('dog_Unsplash');
  });

  test('without authorization header', async () => {
    const response = await request(app).post('/graphql').set('Accept', 'application/json').send({
      query: `query { images(keyword: "cat") { image_ID thumbnails preview title source tags } }`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.errors[0].message).toEqual('require login');
  });

  afterAll(async () => {
    await db.close();
  });
});
