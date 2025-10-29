declare global {
  var __FASTIFY__: Awaited<ReturnType<typeof import('../../src/server.ts')['buildServer']>>;
}

export {};
