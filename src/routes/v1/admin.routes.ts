import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middlewares/authentication.js';
import { hasPermission } from '../../middlewares/rbac.js';

export const adminRoutes = async (app: FastifyInstance) => {
  app.get('/api/v1/admin/audit', {
    preHandler: [authenticate, hasPermission({ resource: 'logs', action: 'read' })],
    handler: async (request, reply) => {
      request.log.info('Audit log listing requested');
      reply.send({ status: 'ok' });
    }
  });
};
