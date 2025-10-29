import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/prisma.client.js';

interface PermissionGuard {
  resource: string;
  action: string;
}

export const hasPermission = ({ resource, action }: PermissionGuard) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.sub as string | undefined;

    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const allowed = user.roles.some((userRole) =>
      userRole.role.permissions.some(
        (perm) => perm.permission.resource === resource && perm.permission.action === action
      )
    );

    if (!allowed) {
      request.log.warn({ userId, resource, action }, 'RBAC denial');
      return reply.status(403).send({ message: 'Forbidden' });
    }
  };
