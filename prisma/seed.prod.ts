import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function assertSafeToSeedProd() {
  const mode = process.env.SEED_MODE;
  const url = process.env.DATABASE_URL ?? '';

  // защита от случайного запуска "продового" сида
  if (mode !== 'prod') {
    throw new Error('Refusing to run prod seed unless SEED_MODE=prod.');
  }

  if (!url) {
    throw new Error('DATABASE_URL is missing.');
  }
}

async function main() {
  assertSafeToSeedProd();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const pepper = process.env.ADMIN_PEPPER;

  if (!email || !password || !pepper) {
    throw new Error('Missing ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_PEPPER in env.');
  }

  // bcrypt сам делает соль и хранит её внутри строки хэша
  // pepper (секретный код) усиливает: хешируем password + pepper
  const passwordHash = await bcrypt.hash(password + pepper, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'admin' },
    create: { email, passwordHash, role: 'admin' },
  });

  console.log('✅ Prod seed done:', { adminEmail: email });
}

console.log('Generating prod seed...');
main()
  .catch((e) => {
    console.error('❌ Prod seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
