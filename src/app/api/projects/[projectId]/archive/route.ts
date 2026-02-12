import { prisma } from '@/lib/prisma';
import { ok, unauthorized } from '@/server/helpers/http';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';

export async function POST(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  if (!requireAuth()) return unauthorized();
  const { projectId } = await ctx.params;

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date() },
    select: { id: true, archivedAt: true },
  });

  revalidateAfterProjectChange(projectId);

  return ok(project);
}
