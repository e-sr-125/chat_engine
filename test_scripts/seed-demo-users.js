const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  await prisma.user.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      org_default_id: 'org-1',
      username: 'user1',
      email: 'user1@example.com',
      email_hash: Buffer.from('user1@example.com'),
      password: 'placeholder',
      created_at: now,
    },
  });

  await prisma.user.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      org_default_id: 'org-2',
      username: 'user2',
      email: 'user2@example.com',
      email_hash: Buffer.from('user2@example.com'),
      password: 'placeholder',
      created_at: now,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());