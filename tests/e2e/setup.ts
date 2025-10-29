process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.PORT = process.env.PORT ?? '0';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-key-test-secret-key';
process.env.JWT_ISSUER = process.env.JWT_ISSUER ?? 'test-issuer';
process.env.JWT_TTL = process.env.JWT_TTL ?? '900s';
process.env.COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'test-cookie-secret-key';
process.env.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME ?? 'sid';
process.env.CORS_WHITELIST = process.env.CORS_WHITELIST ?? 'http://localhost:3000';

let serverInstance: Awaited<ReturnType<typeof import('../../src/server.ts')['buildServer']>>;

beforeAll(async () => {
  const { buildServer } = await import('../../src/server.ts');
  serverInstance = await buildServer();
  await serverInstance.ready();
  (globalThis as typeof globalThis & { __FASTIFY__: typeof serverInstance }).__FASTIFY__ =
    serverInstance;
});

afterAll(async () => {
  if (serverInstance) {
    await serverInstance.close();
  }
});
