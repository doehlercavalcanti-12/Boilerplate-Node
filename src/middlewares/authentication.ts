import type { FastifyReply, FastifyRequest } from 'fastify';
import { getRequestContext } from './request-context.js';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const context = getRequestContext();
    if (context) {
      context.userId = request.user?.sub;
    }
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
};
