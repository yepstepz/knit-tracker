import { prisma } from '@/lib/prisma';
import { ok } from '@/server/helpers/http';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export const POST = withAuth(async (_req: Request, ctx: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await ctx.params;

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date() },
    select: { id: true, archivedAt: true },
  });

  revalidateAfterProjectChange(projectId);

  return ok(project);
});
