import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export const POST = withAuth(async (_req: Request, ctx: { params: Promise<{ projectId: string }> }) => {
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
});
