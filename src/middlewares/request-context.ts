import { AsyncLocalStorage } from 'node:async_hooks';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type RequestContextStore = {
  requestId: string;
  userId?: string | null;
};

const storage = new AsyncLocalStorage<RequestContextStore>();

export const requestContextHook = async (request: FastifyRequest, reply: FastifyReply) => {
  storage.run({ requestId: request.id, userId: request.user?.sub }, () => {
    reply.header('x-request-id', request.id);
  });
};

export const getRequestContext = () => storage.getStore();
