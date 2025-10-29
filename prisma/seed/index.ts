import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

const seed = async () => {
  const passwordHash = await hash('ChangeMe123!');

  const loginPermission = await prisma.permission.upsert({
    where: { resource_action: { resource: 'auth', action: 'login:perform' } },
    update: {},
    create: {
      resource: 'auth',
      action: 'login:perform',
      description: 'Allow login endpoint access'
    }
  });

  const manageUserPermission = await prisma.permission.upsert({
    where: { resource_action: { resource: 'user', action: 'manage' } },
    update: {},
    create: {
      resource: 'user',
      action: 'manage',
      description: 'Manage platform users'
    }
  });

  const readLogsPermission = await prisma.permission.upsert({
    where: { resource_action: { resource: 'logs', action: 'read' } },
    update: {},
    create: {
      resource: 'logs',
      action: 'read',
      description: 'Read audit logs'
    }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full access to administrative features',
      permissions: {
        create: [
          { permissionId: loginPermission.id },
          { permissionId: manageUserPermission.id }
        ]
      }
    }
  });

  const auditorRole = await prisma.role.upsert({
    where: { name: 'auditor' },
    update: {},
    create: {
      name: 'auditor',
      description: 'Read-only access to audit logs',
      permissions: {
        create: [{ permissionId: readLogsPermission.id }]
      }
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      roles: {
        create: [{ roleId: adminRole.id }]
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      level: 'INFO',
      message: 'Seeded administrative user',
      meta: { traceId: randomUUID() }
    }
  });

  await prisma.auditLog.create({
    data: {
      level: 'INFO',
      message: 'Seed completed',
      meta: { traceId: randomUUID(), roles: [adminRole.name, auditorRole.name] }
    }
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
