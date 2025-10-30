import request from 'supertest';

describe('server bootstrap', () => {
  it('exposes metrics endpoint', async () => {
    const app = (
      globalThis as typeof globalThis & {
        __FASTIFY__: Awaited<ReturnType<typeof import('../../src/server.js')['buildServer']>>;
      }
    ).__FASTIFY__;
    const response = await request(app.server).get('/metrics');
    expect(response.status).toBe(200);
  });
});
