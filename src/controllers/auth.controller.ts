import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../config/env.js';
import type { LoginBody } from '../schemas/auth.schema.js';
import { loginService } from '../services/auth.service.js';

export const loginController = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  const result = await loginService(request.server, request.body);

  reply
    .setCookie(env.jwtCookieName, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      signed: true
    })
    .send({
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
      user: result.user
    });
};
