import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound, unauthorized } from '@/server/helpers/http';
import { revalidateTagsImpact } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; tagId: string }> },
) {
  if (!requireAuth()) return unauthorized();
  const { projectId, tagId } = await ctx.params;

  if (!projectId) return badRequest('[projectId] required');
  if (!tagId) return badRequest('tagId required');

  // deleteMany: чтобы не кидать исключение, если связи нет
  const res = await prisma.projectTag.deleteMany({
    where: { projectId, tagId },
  });

  if (res.count === 0) return notFound('tag link not found');

  // возвращаем актуальный список тегов проекта (уплощённо)
  const links = await prisma.projectTag.findMany({
    where: { projectId },
    include: { tag: true },
    orderBy: { createdAt: 'asc' },
  });

  revalidateTagsImpact({ projectId, tagId });

  return ok(links.map((x) => x.tag));
}
