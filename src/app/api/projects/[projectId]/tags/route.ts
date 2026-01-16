import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);

  if (!projectId) return badRequest("projectId required");
  const tagId = typeof body?.tagId === "string" ? body.tagId : null;
  if (!tagId) return badRequest("tagId required");

  // убедимся, что проект существует (чтобы не создавать "битую" связь)
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound("project not found");

  // убедимся, что тег существует
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    select: { id: true },
  });
  if (!tag) return notFound("tag not found");

  // создаём связь; если уже есть — не падаем
  await prisma.projectTag.upsert({
    where: { projectId_tagId: { projectId, tagId } },
    create: { projectId, tagId },
    update: {}, // ничего не меняем
  });

  // возвращаем актуальный список тегов проекта (уплощённо)
  const links = await prisma.projectTag.findMany({
    where: { projectId },
    include: { tag: true },
    orderBy: { createdAt: "asc" },
  });

  return ok(links.map((x) => x.tag));
}
