import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create a test URL
  const url = await prisma.url.upsert({
    where: { shortCode: 'custom123' },
    update: {},
    create: {
      originalUrl: 'https://example.com',
      shortCode: 'custom123',
      userId: user.id,
      analytics: {
        create: {
          totalClicks: 0,
          uniqueClicks: 0,
        }
      }
    },
  });

  console.log(`Created URL with id: ${url.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
