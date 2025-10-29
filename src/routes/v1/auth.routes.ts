import type { FastifyInstance } from 'fastify';
import { loginController } from '../../controllers/auth.controller.js';
import { loginSchema } from '../../schemas/auth.schema.js';

export const authRoutes = async (app: FastifyInstance) => {
  app.post('/api/v1/auth/login', {
    schema: loginSchema,
    preHandler: [app.csrfProtection],
    handler: loginController
  });

  app.get('/api/v1/auth/google/callback', async (request, reply) => {
    const token = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    request.log.info({ provider: 'google' }, 'OAuth2 callback handled');
    reply.send({ token });
  });
};
