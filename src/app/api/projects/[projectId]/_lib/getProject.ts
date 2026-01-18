import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";
import { PhotoRole } from "@prisma/client";

const LOG_PREVIEW_LIMIT = 5;

type ProjectPreview = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  startedAt: Date | null;
  cover: any | null; // Photo | null
  tags: Array<{ id: string; name: string; color: string | null }>;
};

function toPreview(p: any): ProjectPreview {
  return {
    id: p.id,
    title: p.title,
    status: p.status,
    createdAt: p.createdAt,
    startedAt: p.startedAt,
    cover: Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] : null,
    tags: Array.isArray(p.tags) ? p.tags.map((x: any) => x.tag) : [],
  };
}

export async function getProject(projectId: string) {
  if (!projectId) return badRequest("projectId required");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tags: { include: { tag: true } },
      photos: true,
      logEntries: {
        orderBy: { happenedAt: "desc" },
        take: LOG_PREVIEW_LIMIT + 1,
        include: { photo: true },
      },

      // preview "основан на"
      basedOn: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          startedAt: true,
          photos: { where: { role: PhotoRole.COVER }, take: 1 },
          tags: { include: { tag: true } },
        },
      },

      // preview "повторы"
      derivedProjects: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          startedAt: true,
          photos: { where: { role: PhotoRole.COVER }, take: 1 },
          tags: { include: { tag: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!project) return notFound();

  const hasMoreLogs = project.logEntries.length > LOG_PREVIEW_LIMIT;
  const logEntries = hasMoreLogs
    ? project.logEntries.slice(0, LOG_PREVIEW_LIMIT)
    : project.logEntries;

  return ok({
    ...project,
    logEntries,
    logEntriesHasMore: hasMoreLogs,
  });
}
