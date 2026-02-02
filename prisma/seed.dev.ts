import { PrismaClient, ProjectStatus, PhotoRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function assertSafeToSeed() {
  const env = process.env.NODE_ENV;
  const url = process.env.DATABASE_URL ?? '';

  if (env === 'production') {
    throw new Error('Refusing to run seed in production (NODE_ENV=production).');
  }

  let host = '';
  try {
    host = new URL(url).hostname;
  } catch {
    host = '';
  }

  if (!['localhost', '127.0.0.1'].includes(host)) {
    throw new Error(`Refusing to run seed for non-local DB host: ${host}`);
  }
}

// 1x1 прозрачный gif — никаких сетевых запросов
const PLACEHOLDER_URI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function uniqById(items: { id: string }[]) {
  return Array.from(new Map(items.map((x) => [x.id, x])).values());
}

async function main() {
  assertSafeToSeed();

  const email = process.env.ADMIN_EMAIL ?? 'dev@local';
  const password = process.env.ADMIN_PASSWORD ?? 'dev-password';
  const pepper = process.env.ADMIN_PEPPER ?? 'dev-pepper';

  const passwordHash = await bcrypt.hash(password + pepper, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'admin' },
    create: { email, passwordHash, role: 'admin' },
  });

  // --- Tags (upsert by name) ---
  const tagSweater = await prisma.tag.upsert({
    where: { name: 'свитер' },
    create: { name: 'свитер', color: '#9BB7A5' },
    update: {},
  });

  const tagGift = await prisma.tag.upsert({
    where: { name: 'подарок' },
    create: { name: 'подарок', color: '#C9A38B' },
    update: {},
  });

  const tagRepeat = await prisma.tag.upsert({
    where: { name: 'повтор' },
    create: { name: 'повтор', color: '#B9B6E7' },
    update: {},
  });

  const tagSummer = await prisma.tag.upsert({
    where: { name: 'лето' },
    create: { name: 'лето', color: '#E8D7A8' },
    update: {},
  });

  const tagQuick = await prisma.tag.upsert({
    where: { name: 'быстро' },
    create: { name: 'быстро', color: '#89A7C2' },
    update: {},
  });

  const allTags = [tagSweater, tagGift, tagRepeat, tagSummer, tagQuick];

  // --- Create 18 projects ---
  const createdProjects: { id: string }[] = [];

  for (let i = 1; i <= 18; i++) {
    const status = pick(
      [ProjectStatus.IDEA, ProjectStatus.ACTIVE, ProjectStatus.PAUSED, ProjectStatus.FINISHED],
      i,
    );

    const archivedAt = i % 9 === 0 ? daysAgo(3) : null;

    const basedOnProjectId =
      i % 6 === 0 && createdProjects.length > 0
        ? createdProjects[createdProjects.length - 1].id
        : null;

    // теги: 2-3 штуки на проект (и дедуп!)
    const rawTagSet =
      i % 6 === 0
        ? [tagSweater, tagRepeat, pick(allTags, i)]
        : i % 3 === 0
          ? [tagGift, pick(allTags, i)]
          : [tagSweater, pick(allTags, i)];

    const uniqueTagIds = uniqById(rawTagSet).map((t) => t.id);

    const projectPhotos =
      i % 4 === 0
        ? [
            {
              uri: PLACEHOLDER_URI,
              caption: `Cover #${i}`,
              alt: `Cover #${i}`,
              role: PhotoRole.COVER,
              sortOrder: 1,
            },
            {
              uri: PLACEHOLDER_URI,
              caption: `Gallery A #${i}`,
              alt: `Gallery A #${i}`,
              role: PhotoRole.GALLERY,
              sortOrder: 2,
            },
            {
              uri: PLACEHOLDER_URI,
              caption: `Gallery B #${i}`,
              alt: `Gallery B #${i}`,
              role: PhotoRole.GALLERY,
              sortOrder: 3,
            },
          ]
        : [
            {
              uri: PLACEHOLDER_URI,
              caption: `Cover #${i}`,
              alt: `Cover #${i}`,
              role: PhotoRole.COVER,
              sortOrder: 1,
            },
          ];

    const logsCount = 2 + (i % 3); // 2..4
    const logEntries = Array.from({ length: logsCount }).map((_, idx) => {
      const happenedAt = daysAgo(20 - i - idx);

      const base = {
        title: `Log ${idx + 1} (seed #${i})`,
        contentMd: `Seed log entry ${idx + 1} for project #${i}.`,
        happenedAt,
      };

      if (idx === 0 && i % 2 === 0) {
        return {
          ...base,
          photo: {
            create: {
              uri: PLACEHOLDER_URI,
              caption: `Progress photo (seed #${i})`,
              alt: `Progress photo (seed #${i})`,
              role: PhotoRole.GALLERY,
              sortOrder: 1,
            },
          },
        };
      }

      return base;
    });

    const project = await prisma.project.create({
      data: {
        title: `Project (seed #${i})`,
        status,
        descriptionMd: `## Seed\nТестовый проект #${i} для UI.`,
        yarnPlan: `Пряжа: seed plan #${i}`,
        startedAt: status !== ProjectStatus.IDEA ? daysAgo(30 - i) : null,
        finishedAt: status === ProjectStatus.FINISHED ? daysAgo(2 + (i % 5)) : null,
        archivedAt,

        ...(basedOnProjectId ? { basedOnProjectId } : {}),

        tags: {
          create: uniqueTagIds.map((tagId) => ({ tagId })),
        },

        photos: {
          create: projectPhotos,
        },

        logEntries: {
          create: logEntries as any,
        },
      },
      select: { id: true },
    });

    createdProjects.push(project);
  }

  console.log('✅ Seed done:', {
    createdProjects: createdProjects.length,
    sampleIds: createdProjects.slice(0, 3).map((p) => p.id),
  });
}

console.log('Generating seed...');
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
