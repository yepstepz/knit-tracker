import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, notFound } from "@/server/helpers/http";

function toDateOrUndefined(value: unknown) {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest("projectId required");

  // если хочешь строго: убедимся, что проект существует
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound("project not found");

  const entries = await prisma.projectLogEntry.findMany({
    where: { projectId },
    orderBy: { happenedAt: "desc" },
    include: { photos: true },
  });

  return ok(entries);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest("projectId required");

  const body = await req.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) return badRequest("title required");

  const contentMd =
    body?.contentMd === null
      ? ""
      : typeof body?.contentMd === "string"
        ? body.contentMd
        : "";

  const happenedAtParsed = toDateOrUndefined(body?.happenedAt);
  if (happenedAtParsed === null) {
    return badRequest("happenedAt must be ISO date string");
  }

  // убедимся, что проект существует (чтобы не создавать “битую” запись)
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound("project not found");

  const entry = await prisma.projectLogEntry.create({
    data: {
      projectId,
      title,
      contentMd,
      // если happenedAt не передали — Prisma возьмёт default(now()) если он есть в схеме,
      // иначе нужно явно подставить new Date()
      ...(happenedAtParsed ? { happenedAt: happenedAtParsed } : {}),
    },
    include: { photos: true },
  });

  return created(entry);
}
