import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, created, badRequest, notFound } from '@/server/helpers/http';
import { toDateOrUndefined } from '@/server/helpers/dates';
import { clamp, DEFAULT_LIMIT, MAX_LIMIT, parsePositiveInt } from '@/server/helpers/pagination';
import { revalidateAfterLogChange } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export async function GET(req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest('[projectId] required');

  const url = new URL(req.url);

  const pageParsed = parsePositiveInt(url.searchParams.get('page'), 1);
  if (pageParsed === null) return badRequest('page must be integer >= 1');

  const limitParsed = parsePositiveInt(url.searchParams.get('limit'), DEFAULT_LIMIT);
  if (limitParsed === null) return badRequest('limit must be integer >= 1');

  const page = pageParsed;
  const limit = clamp(limitParsed, 1, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound('project not found');

  const where = { projectId };

  const total = await prisma.projectLogEntry.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const items = await prisma.projectLogEntry.findMany({
    where,
    orderBy: [{ happenedAt: 'desc' }, { createdAt: 'desc' }],
    skip,
    take: limit,
    include: { photo: true }, // one-to-one
  });

  return ok({
    items,
    page,
    limit,
    total,
    totalPages,
  });
}

export const POST = withAuth(async (req: Request, ctx: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest('[projectId] required');

  const body = await req.json().catch(() => null);

  const title = typeof body?.title === 'string' ? body.title.trim() : '';

  const contentMd =
    body?.contentMd === null ? '' : typeof body?.contentMd === 'string' ? body.contentMd : '';
  if (!contentMd.trim()) return badRequest('contentMd required');

  const happenedAtParsed = toDateOrUndefined(body?.happenedAt);
  if (happenedAtParsed === null) {
    return badRequest('happenedAt must be ISO date string');
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound('project not found');

  const entry = await prisma.projectLogEntry.create({
    data: {
      projectId,
      title,
      contentMd,
      ...(happenedAtParsed ? { happenedAt: happenedAtParsed } : {}),
    },
    include: { photo: true },
  });

  revalidateAfterLogChange(projectId);

  return created(entry);
});
