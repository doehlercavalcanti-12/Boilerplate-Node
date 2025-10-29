import type { FastifyReply, FastifyRequest } from 'fastify';

export const securityHeaders = async (
  _request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown
) => {
  reply.headers({
    'referrer-policy': 'no-referrer',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY'
  });

  return payload;
};
