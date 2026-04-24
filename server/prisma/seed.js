import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Full system access' },
  });

  const editor = await prisma.role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: { name: 'Editor', description: 'Can read and write content' },
  });

  const viewer = await prisma.role.upsert({
    where: { name: 'Viewer' },
    update: {},
    create: { name: 'Viewer', description: 'Read-only access' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Alice Admin', email: 'admin@example.com', roleId: admin.id },
  });

  await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: { name: 'Bob Editor', email: 'editor@example.com', roleId: editor.id },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: {},
    create: { name: 'Carol Viewer', email: 'viewer@example.com', roleId: viewer.id },
  });

  console.log('Database seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
