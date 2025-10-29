import { captureException, init, flush } from '@sentry/node';
import type { FastifyInstance } from 'fastify';
import { env } from '../config/env.js';

export const sentryPlugin = async (app: FastifyInstance) => {
  if (!env.sentryDsn) {
    app.log.warn('Sentry DSN not configured; skipping instrumentation');
    return;
  }

  init({
    dsn: env.sentryDsn,
    tracesSampleRate: env.nodeEnv === 'production' ? 0.1 : 1.0,
    environment: env.nodeEnv
  });

  app.addHook('onError', async (request, reply, error) => {
    captureException(error, (scope) => {
      if (request.user?.sub) {
        scope.setUser({ id: request.user.sub });
      }
      scope.setTags({ requestId: request.id });
      scope.setExtras({ route: request.routeOptions?.url });
      return scope;
    });

    if (!reply.sent) {
      reply.status(error.statusCode ?? 500).send({
        statusCode: error.statusCode ?? 500,
        error: error.name,
        message: env.nodeEnv === 'production' ? 'Internal Server Error' : error.message
      });
    }
  });

  app.addHook('onClose', async () => {
    await flush(2000);
  });
};
