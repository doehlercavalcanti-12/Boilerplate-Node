import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

const prismaClientSingleton = () =>
  new PrismaClient({
    datasources: { db: { url: env.databaseUrl } },
    log: env.nodeEnv === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    errorFormat: 'colorless'
  });

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (env.nodeEnv !== 'production') {
  globalThis.prisma = prisma;
}

export const configurePrismaPool = () => {
  // Pool sizing hints used by upstream Postgres driver when pooling is enabled:
  // - `min` keeps warm connections ready for burst traffic.
  // - `max` caps concurrent database sessions to prevent saturation.
  // - `idleTimeoutMillis` closes idle clients after the configured interval.
  // When the pool is saturated Prisma queues new queries; Fastify propagates
  // backpressure which results in 503 responses if requests exceed timeouts.
  return {
    min: env.pool.min,
    max: env.pool.max,
    idleTimeoutMillis: env.pool.idleTimeoutSeconds * 1000,
    afterCreate: () => {
      /* When pool saturates Prisma queues queries until Fastify backpressure triggers 503 */
    }
  };
};
