import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest("[projectId] required");

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { archivedAt: null },
    });
    return ok({ ok: true });
  } catch {
    return notFound("project not found");
  }
}
