import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FastifyReply, FastifyRequest } from 'fastify';
import pino from 'pino';
import { createStream } from 'rotating-file-stream';
import { env } from './env.js';

const retentionDays = env.nodeEnv === 'production' ? 30 : 3;
const logDirectory = resolve(env.logDir);

if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory, { recursive: true });
}

const stream = createStream('%Y-%m-%d.log', {
  size: '20M',
  interval: '1d',
  maxFiles: retentionDays,
  compress: 'gzip',
  path: logDirectory
});

const redactionPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.token',
  'response.accessToken'
];

const redaction = {
  paths: redactionPaths,
  remove: true
} as const;

const baseLoggerOptions: pino.LoggerOptions = {
  level: env.logLevel,
  redact: redaction,
  messageKey: 'message',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() })
  }
};

if (env.nodeEnv !== 'test') {
  baseLoggerOptions.transport = {
    targets: [
      {
        target: 'pino/file',
        options: { destination: 1 }
      },
      {
        target: 'pino-abstract-transport',
        options: {
          stream,
          worker: { autoEnd: true }
        }
      }
    ]
  };
}

export const logger = pino(baseLoggerOptions, env.nodeEnv !== 'test' ? stream : undefined);

export const httpLoggerOptions = {
  logger,
  genReqId: () => randomUUID(),
  redact: redaction,
  customProps: (req: FastifyRequest) => ({
    requestId: req.id,
    userId: req.user?.sub ?? null,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }),
  customAttributeKeys: {
    req: 'request',
    res: 'response'
  },
  serializers: {
    req(request: FastifyRequest) {
      return {
        id: request.id,
        method: request.method,
        url: request.url,
        headers: {
          'user-agent': request.headers['user-agent'],
          'content-type': request.headers['content-type']
        }
      };
    },
    res(reply: FastifyReply) {
      const timedReply = reply as FastifyReply & { getResponseTime?: () => number };
      return {
        statusCode: reply.statusCode,
        responseTime: timedReply.getResponseTime?.()
      };
    }
  }
};
