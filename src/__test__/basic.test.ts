import request from 'supertest';
import app from '../app';
import server from '../apollo';
import { initPassport } from '../auth';

describe('query health', () => {
  beforeAll(() => {
    initPassport();
    server.applyMiddleware({ app });
  });

  test('return OK', async () => {
    const response = await request(app).post('/graphql').set('Accept', 'application/json').send({
      query: 'query { health }',
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data.health).toEqual('OK');
  });
});
