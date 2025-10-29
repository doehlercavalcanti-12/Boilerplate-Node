import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProvider,
  FastifyTypeProviderDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault
} from 'fastify';
import { authRoutes } from './v1/auth.routes.js';
import { adminRoutes } from './v1/admin.routes.js';

export const registerRoutes = async <
  RawServer extends RawServerDefault = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault
>(
  app: FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider>
) => {
  await app.register(authRoutes);
  await app.register(adminRoutes);
};
