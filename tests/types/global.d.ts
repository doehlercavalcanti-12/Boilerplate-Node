declare global {
  var __FASTIFY__: Awaited<ReturnType<typeof import('../../src/server.js')['buildServer']>>;
}

export {};
