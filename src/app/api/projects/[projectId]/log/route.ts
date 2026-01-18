import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, notFound } from "@/server/helpers/http";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function toDateOrUndefined(value: unknown) {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (value === null) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  if (!projectId) return badRequest("projectId required");

  const url = new URL(req.url);

  const pageParsed = parsePositiveInt(url.searchParams.get("page"), 1);
  if (pageParsed === null) return badRequest("page must be integer >= 1");

  const limitParsed = parsePositiveInt(
    url.searchParams.get("limit"),
    DEFAULT_LIMIT
  );
  if (limitParsed === null) return badRequest("limit must be integer >= 1");

  const page = pageParsed;
  const limit = clamp(limitParsed, 1, MAX_LIMIT);
  const skip = (page - 1) * limit;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound("project not found");

  const where = { projectId };

  const total = await prisma.projectLogEntry.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const items = await prisma.projectLogEntry.findMany({
    where,
    orderBy: { happenedAt: "desc" },
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
      ...(happenedAtParsed ? { happenedAt: happenedAtParsed } : {}),
    },
    include: { photo: true },
  });

  return created(entry);
}
