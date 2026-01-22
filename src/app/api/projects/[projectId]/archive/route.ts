import { prisma } from '@/lib/prisma';
import { ok } from '@/server/helpers/http';

export async function POST(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date() },
    select: { id: true, archivedAt: true },
  });

  return ok(project);
}
