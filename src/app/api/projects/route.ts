import { prisma } from '@/lib/prisma';
import { PhotoRole, ProjectStatus } from '@prisma/client';
import { ok, created, badRequest } from '@/server/helpers/http';
import { clamp, DEFAULT_LIMIT, MAX_LIMIT, parsePositiveInt } from '@/server/helpers/pagination';
import { revalidateAfterProjectChange, revalidateTagsImpact } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tagId = url.searchParams.get('tagId');
  const archived = url.searchParams.get('archived'); // "1" -> архив, иначе активные

  const pageParsed = parsePositiveInt(url.searchParams.get('page'), 1);
  if (pageParsed === null) return badRequest('page must be integer >= 1');

  const limitParsed = parsePositiveInt(url.searchParams.get('limit'), DEFAULT_LIMIT);
  if (limitParsed === null) return badRequest('limit must be integer >= 1');

  const page = pageParsed;
  const limit = clamp(limitParsed, 1, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const where: any = archived === '1' ? { archivedAt: { not: null } } : { archivedAt: null };

  if (tagId) {
    where.tags = { some: { tagId } };
  }

  const total = await prisma.project.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const projects = await prisma.project.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    skip,
    take: limit,
    include: {
      tags: { include: { tag: true } },
      photos: { where: { role: PhotoRole.COVER }, take: 1 }, // берём только cover
    },
  });

  const items = projects.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    descriptionMd: p.descriptionMd,
    yarnPlan: p.yarnPlan,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    startedAt: p.startedAt,
    finishedAt: p.finishedAt,
    archivedAt: p.archivedAt,
    basedOnProjectId: p.basedOnProjectId,

    tags: p.tags.map((x) => x.tag),
    cover: p.photos[0] ?? null,
  }));

  return ok({
    items,
    page,
    limit,
    total,
    totalPages,
  });
}

export const POST = withAuth(async (req: Request) => {
  const body = await req.json().catch(() => null);

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return badRequest('title required');
  }

  const project = await prisma.project.create({
    data: {
      title,
      status: body?.status ?? ProjectStatus.IDEA,
      descriptionMd: typeof body?.descriptionMd === 'string' ? body.descriptionMd : '',
      yarnPlan: typeof body?.yarnPlan === 'string' ? body.yarnPlan : '',
      needles: typeof body?.needles === 'string' ? body.needles : null,
      currentGaugeStitches:
        typeof body?.currentGaugeStitches === 'number' ? body.currentGaugeStitches : null,
      currentGaugeRows: typeof body?.currentGaugeRows === 'number' ? body.currentGaugeRows : null,
      patternGaugeStitches:
        typeof body?.patternGaugeStitches === 'number' ? body.patternGaugeStitches : null,
      patternGaugeRows:
        typeof body?.patternGaugeRows === 'number' ? body.patternGaugeRows : null,
    },
  });

  revalidateAfterProjectChange(project.id);

  return created(project);
});
