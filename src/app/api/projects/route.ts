import { prisma } from "@/lib/prisma";
import { PhotoRole, ProjectStatus } from "@prisma/client";
import { ok, created, badRequest } from "@/server/helpers/http";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tagId = url.searchParams.get("tagId");
  const archived = url.searchParams.get("archived"); // "1" -> архив, иначе активные

  const where: any = archived === "1"
    ? { archivedAt: { not: null } }
    : { archivedAt: null };

  if (tagId) {
    where.tags = { some: { tagId } };
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      tags: { include: { tag: true } },
      photos: { where: { role: PhotoRole.COVER }, take: 1 },
    },
  });

  const dto = projects.map((p) => ({
    ...p,
    tags: p.tags.map((x) => x.tag),
  }));

  return ok(dto);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return badRequest("title required");
  }

  const project = await prisma.project.create({
    data: {
      title,
      status: body?.status ?? ProjectStatus.IDEA,
      descriptionMd: typeof body?.descriptionMd === "string" ? body.descriptionMd : "",
      yarnPlan: typeof body?.yarnPlan === "string" ? body.yarnPlan : "",
    },
  });

  return created(project);
}
