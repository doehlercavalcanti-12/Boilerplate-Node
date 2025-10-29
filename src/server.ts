import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import csrfProtection from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import metrics from 'fastify-metrics';
import oauthPlugin from '@fastify/oauth2';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { env } from './config/env.js';
import { logger } from './config/logging.js';
import { registerRoutes } from './routes/index.js';
import { requestContextHook } from './middlewares/request-context.js';
import { securityHeaders } from './middlewares/security-headers.js';
import { sentryPlugin } from './plugins/sentry.js';

export const buildServer = async () => {
  const app = Fastify({
    logger: false,
    loggerInstance: logger,
    disableRequestLogging: true,
    trustProxy: true,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: true
      }
    }
  });

  await app.register(sensible);
  await app.register(sentryPlugin);

  app.addHook('onRequest', requestContextHook);
  app.addHook('onSend', securityHeaders);

  await app.register(cookie, {
    secret: env.cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.nodeEnv !== 'development'
    }
  });

  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || env.corsWhitelist.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin not allowed'), false);
    },
    credentials: true
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false
  });

  await app.register(rateLimit, {
    max: env.rateLimit.max,
    timeWindow: env.rateLimit.window,
    allowList: env.rateLimit.allowList,
    hook: 'onRequest'
  });

  await app.register(csrfProtection, {
    sessionPlugin: '@fastify/cookie',
    cookieOpts: {
      httpOnly: true,
      sameSite: 'strict',
      secure: env.nodeEnv !== 'development'
    }
  });

  await app.register(jwt, {
    secret: env.jwtSecret,
    cookie: { cookieName: env.jwtCookieName, signed: true },
    sign: {
      expiresIn: env.jwtTtl
    }
  });

  const googleConfiguration = (oauthPlugin as unknown as {
    GOOGLE_CONFIGURATION: { tokenHost: string; tokenPath: string; authorizeHost: string; authorizePath: string };
  }).GOOGLE_CONFIGURATION;

  await app.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['openid', 'email', 'profile'],
    credentials: {
      client: {
        id: env.googleClientId,
        secret: env.googleClientSecret
      },
      auth: googleConfiguration
    },
    startRedirectPath: '/api/v1/auth/google',
    callbackUri: env.googleCallbackUrl
  });

  app.addHook('onResponse', (request, reply, done) => {
    const timedReply = reply as FastifyReply & { getResponseTime?: () => number };
    request.log.info(
      {
        requestId: request.id,
        userId: request.user?.sub ?? null,
        ip: request.ip,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: timedReply.getResponseTime?.()
      },
      'request.completed'
    );
    done();
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Boilerplate API',
        description: 'Secure Fastify API boilerplate',
        version: '1.0.0'
      },
      servers: [{ url: '/api/v1' }]
    }
  });
  await app.register(swaggerUI, {
    routePrefix: '/docs',
    staticCSP: true
  });

  if (env.nodeEnv === 'test') {
    app.get('/metrics', async (_, reply) => {
      return reply.type('text/plain').send('# Metrics collection disabled in test environment');
    });
  } else {
    await app.register(metrics as unknown as Parameters<FastifyInstance['register']>[0], {
      endpoint: '/metrics',
      defaultMetrics: {
        enabled: true
      }
    });
  }

  await registerRoutes(app);

  app.setErrorHandler(async (error, request, reply) => {
    request.log.error({ err: error, requestId: request.id }, 'Unhandled error');
    reply.status(error.statusCode ?? 500).send({
      statusCode: error.statusCode ?? 500,
      error: error.name,
      message: env.nodeEnv === 'production' ? 'Internal Server Error' : error.message
    });
  });

  app.addHook('onClose', async () => {
    const { prisma } = await import('./db/prisma.client.js');
    await prisma.$disconnect();
  });

  return app;
};

if (env.isPrimary) {
  const start = async () => {
    const server = await buildServer();
    try {
      await server.listen({ port: env.port, host: '0.0.0.0' });
      server.log.info({ port: env.port }, 'API started');
    } catch (error) {
      server.log.error({ err: error }, 'Startup failure');
      process.exit(1);
    }
  };

  start().catch((error) => {
    logger.error({ err: error }, 'Fatal error during bootstrap');
    process.exit(1);
  });
}
