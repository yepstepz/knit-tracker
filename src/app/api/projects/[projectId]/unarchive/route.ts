import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound, unauthorized } from '@/server/helpers/http';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';

export async function POST(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  if (!requireAuth()) return unauthorized();
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest('[projectId] required');

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { archivedAt: null },
    });
    revalidateAfterProjectChange(projectId);
    return ok({ ok: true });
  } catch {
    return notFound('project not found');
  }
}
