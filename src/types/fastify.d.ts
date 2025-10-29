import '@fastify/jwt';
import '@fastify/csrf-protection';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      roles: string[];
      permissions: string[];
    };
    user: {
      sub: string;
      roles: string[];
      permissions: string[];
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    csrfProtection: (
      request: import('fastify').FastifyRequest,
      reply: import('fastify').FastifyReply,
      done: () => void
    ) => void;
    googleOAuth2: {
      getAccessTokenFromAuthorizationCodeFlow: (request: import('fastify').FastifyRequest) => Promise<unknown>;
    };
  }
}
