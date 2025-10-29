import type { FastifyInstance } from 'fastify';
import { SignJWT } from 'jose';
import { env } from '../config/env.js';
import { findUserWithRolesByEmail } from '../repositories/user.repository.js';
import { verifyPassword } from '../utils/crypto.js';

export type LoginInput = { email: string; password: string };

export const loginService = async (app: FastifyInstance, { email, password }: LoginInput) => {
  const user = await findUserWithRolesByEmail(email);

  if (!user || !(await verifyPassword(user.passwordHash, password)) || !user.isActive) {
    throw app.httpErrors.unauthorized('Invalid credentials');
  }

  const permissions = user.roles.flatMap((role) =>
    role.role.permissions.map((perm) => `${perm.permission.resource}:${perm.permission.action}`)
  );

  const token = await new SignJWT({
    sub: user.id,
    roles: user.roles.map((role) => role.role.name),
    permissions
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(env.jwtIssuer)
    .setIssuedAt()
    .setExpirationTime(env.jwtTtl)
    .sign(new TextEncoder().encode(env.jwtSecret));

  return {
    accessToken: token,
    expiresIn: env.jwtTtlSeconds,
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.role.name)
    }
  };
};
