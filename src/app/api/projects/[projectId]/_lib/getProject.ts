import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';
import { PhotoRole, Prisma } from '@prisma/client';

const LOG_PREVIEW_LIMIT = 5;

export async function getProject(projectId: string) {
  if (!projectId) return badRequest('[projectId] required');

  const args = {
    where: { id: projectId },
    include: {
      tags: { include: { tag: true } },
      photos: true,

      logEntries: {
        orderBy: [{ happenedAt: 'desc' }, { createdAt: 'desc' }],
        take: LOG_PREVIEW_LIMIT + 1,
        include: { photo: true },
      },

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

      derivedProjects: {
        orderBy: { updatedAt: 'desc' as const },
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
    },
  } satisfies Prisma.ProjectFindUniqueArgs;

  const project = await prisma.project.findUnique(args);
  if (!project) return notFound();

  let cover = null;
  let photos = [];
  for (let p in project.photos) {
    if (project.photos[p].role === PhotoRole.COVER) {
      cover = project.photos[p];
      continue;
    }
    photos.push(project.photos[p]);
  }

  const hasMoreLogs = project.logEntries.length > LOG_PREVIEW_LIMIT;
  const logEntries = hasMoreLogs
    ? project.logEntries.slice(0, LOG_PREVIEW_LIMIT)
    : project.logEntries;

  return ok({
    ...project,
    tags: project.tags.map((x) => x.tag),

    cover,
    photos,

    logEntries,
    logEntriesHasMore: hasMoreLogs,

    basedOn: project.basedOn
      ? {
          ...project.basedOn,
          tags: project.basedOn.tags.map((x) => x.tag),
          cover: project.basedOn.photos[0] ?? null,
        }
      : null,

    derivedProjects: project.derivedProjects.map((p) => ({
      ...p,
      tags: p.tags.map((x) => x.tag),
      cover: p.photos[0] ?? null,
    })),
  });
}
