import { prisma } from '../db/prisma.client.js';

export const findUserWithRolesByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            include: { permissions: { include: { permission: true } } }
          }
        }
      }
    }
  });
