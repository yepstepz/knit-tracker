import { PrismaClient, ProjectStatus, PhotoRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function assertSafeToSeed() {
  const env = process.env.NODE_ENV;
  const url = process.env.DATABASE_URL ?? "";

  if (env === "production") {
    throw new Error("Refusing to run seed in production (NODE_ENV=production).");
  }

  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = "";
  }

  if (!["localhost", "127.0.0.1"].includes(host)) {
    throw new Error(`Refusing to run seed for non-local DB host: ${host}`);
  }
}

async function main() {
  assertSafeToSeed();

  // --- Tags (upsert by name) ---
  const tagSweater = await prisma.tag.upsert({
    where: { name: "свитер" },
    create: { name: "свитер", color: "#FFFFFF" },
    update: {},
  });

  const tagGift = await prisma.tag.upsert({
    where: { name: "подарок" },
    create: { name: "подарок", color: "#FFFFFF" },
    update: {},
  });

  const tagRepeat = await prisma.tag.upsert({
    where: { name: "повтор" },
    create: { name: "повтор", color: "#FFFFFF" },
    update: {},
  });

  const project1 = await prisma.project.create({
    data: {
      title: "Свитер реглан (seed #1)",
      status: ProjectStatus.ACTIVE,
      descriptionMd: "## Seed\nТестовый проект #1 для UI.",
      yarnPlan: "Пряжа: (пока текст)",
      startedAt: new Date(),
      tags: {
        create: [{ tagId: tagSweater.id }, { tagId: tagGift.id }],
      },
      photos: {
        create: [
          {
            uri: "https://picsum.photos/seed/knit-cover-1/1200/900",
            caption: "Кавер #1",
            alt: "Кавер #1",
            role: PhotoRole.COVER,
            sortOrder: 1,
          },
          {
            uri: "https://picsum.photos/seed/knit-gallery-1/1200/900",
            caption: "Галерея #1",
            alt: "Галерея #1",
            role: PhotoRole.GALLERY,
            sortOrder: 2,
          },
        ],
      },
      logEntries: {
        create: [
          {
            title: "Начала вязать",
            contentMd: "Набрала петли, сделала резинку.",
            happenedAt: new Date(),
          },
          {
            title: "Связала рукав",
            contentMd: "Левый рукав готов.",
            happenedAt: new Date(),
          },
        ],
      },
    },
    include: { logEntries: true },
  });

  if (project1.logEntries[0]) {
    await prisma.photo.create({
      data: {
        logEntryId: project1.logEntries[0].id,
        uri: "https://picsum.photos/seed/knit-log-1/1200/900",
        caption: "Прогресс #1",
        alt: "Прогресс #1",
        role: PhotoRole.GALLERY,
        sortOrder: 1,
      },
    });
  }

  // --- Project #2 (based on Project #1) ---
  const project2 = await prisma.project.create({
    data: {
      title: "Свитер реглан (повтор, seed #2)",
      status: ProjectStatus.IDEA,
      descriptionMd: "## Seed\nТестовый проект #2 — повтор на базе проекта #1.",
      yarnPlan: "Буду использовать похожую пряжу",
      basedOnProjectId: project1.id, // ✅ связь с первым
      tags: {
        create: [{ tagId: tagSweater.id }, { tagId: tagRepeat.id }],
      },
      photos: {
        create: [
          {
            uri: "https://picsum.photos/seed/knit-cover-2/1200/900",
            caption: "Кавер #2",
            alt: "Кавер #2",
            role: PhotoRole.COVER,
            sortOrder: 1,
          },
        ],
      },
      logEntries: {
        create: [
          {
            title: "Идея повтора",
            contentMd: "Хочу повторить с другим цветом.",
            happenedAt: new Date(),
          },
        ],
      },
    },
  });

  console.log("✅ Seed done:", {
    project1Id: project1.id,
    project2Id: project2.id,
    project2BasedOn: project1.id,
  });
}

console.log('Generating seed...');
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
