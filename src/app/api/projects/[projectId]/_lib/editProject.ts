import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';
import { ProjectStatus, PhotoRole } from '@prisma/client';

type EditProjectBody = Partial<{
  title: string;
  status: ProjectStatus | string;
  descriptionMd: string | null;
  yarnPlan: string | null;
  needles: string | null;
  currentGaugeStitches: number | null;
  currentGaugeRows: number | null;
  patternGaugeStitches: number | null;
  patternGaugeRows: number | null;
  startedAt: string | null; // ISO string или null
  finishedAt: string | null; // ISO string или null

  basedOnProjectId: string | null;
}>;

function toDateOrNull(value: unknown) {
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function isProjectStatus(value: string): value is ProjectStatus {
  return (
    value === 'IDEA' ||
    value === 'ACTIVE' ||
    value === 'PAUSED' ||
    value === 'FINISHED' ||
    value === 'ABANDONED'
  );
}

type ProjectPreview = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  startedAt: Date | null;
  cover: any | null;
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

export async function editProject(projectId: string, body: unknown) {
  if (!projectId) return badRequest('[projectId] required');
  if (!body || typeof body !== 'object') return badRequest('invalid json');

  const b = body as EditProjectBody;
  const data: any = {};

  if (b.title !== undefined) {
    const title = typeof b.title === 'string' ? b.title.trim() : '';
    if (!title) return badRequest('title must be non-empty');
    data.title = title;
  }

  if (b.status !== undefined) {
    if (typeof b.status !== 'string') return badRequest('status must be string');
    if (!isProjectStatus(b.status)) return badRequest(`invalid status: ${b.status}`);
    data.status = b.status;
  }

  if (b.descriptionMd !== undefined) {
    if (b.descriptionMd !== null && typeof b.descriptionMd !== 'string') {
      return badRequest('descriptionMd must be string or null');
    }
    data.descriptionMd = b.descriptionMd ?? '';
  }

  if (b.yarnPlan !== undefined) {
    if (b.yarnPlan !== null && typeof b.yarnPlan !== 'string') {
      return badRequest('yarnPlan must be string or null');
    }
    data.yarnPlan = b.yarnPlan ?? '';
  }

  if (b.needles !== undefined) {
    if (b.needles !== null && typeof b.needles !== 'string') {
      return badRequest('needles must be string or null');
    }
    data.needles = b.needles ?? '';
  }

  if (b.currentGaugeStitches !== undefined) {
    if (b.currentGaugeStitches !== null && typeof b.currentGaugeStitches !== 'number') {
      return badRequest('currentGaugeStitches must be number or null');
    }
    data.currentGaugeStitches = b.currentGaugeStitches ?? null;
  }

  if (b.currentGaugeRows !== undefined) {
    if (b.currentGaugeRows !== null && typeof b.currentGaugeRows !== 'number') {
      return badRequest('currentGaugeRows must be number or null');
    }
    data.currentGaugeRows = b.currentGaugeRows ?? null;
  }

  if (b.patternGaugeStitches !== undefined) {
    if (b.patternGaugeStitches !== null && typeof b.patternGaugeStitches !== 'number') {
      return badRequest('patternGaugeStitches must be number or null');
    }
    data.patternGaugeStitches = b.patternGaugeStitches ?? null;
  }

  if (b.patternGaugeRows !== undefined) {
    if (b.patternGaugeRows !== null && typeof b.patternGaugeRows !== 'number') {
      return badRequest('patternGaugeRows must be number or null');
    }
    data.patternGaugeRows = b.patternGaugeRows ?? null;
  }

  if (b.startedAt !== undefined) {
    const startedAt = toDateOrNull(b.startedAt);
    if (startedAt === undefined) return badRequest('startedAt must be ISO string or null');
    data.startedAt = startedAt;
  }

  if (b.finishedAt !== undefined) {
    const finishedAt = toDateOrNull(b.finishedAt);
    if (finishedAt === undefined) return badRequest('finishedAt must be ISO string or null');
    data.finishedAt = finishedAt;
  }

  if (b.basedOnProjectId !== undefined) {
    if (b.basedOnProjectId !== null && typeof b.basedOnProjectId !== 'string') {
      return badRequest('basedOnProjectId must be string or null');
    }
    if (b.basedOnProjectId === projectId) {
      return badRequest('basedOnProjectId cannot be the same as [projectId]');
    }
    data.basedOnProjectId = b.basedOnProjectId ?? null;
  }

  if (Object.keys(data).length === 0) {
    return badRequest('no fields to update');
  }

  // updateMany чтобы красиво вернуть 404 без try/catch
  const updated = await prisma.project.updateMany({
    where: { id: projectId },
    data,
  });

  if (updated.count === 0) return notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tags: { include: { tag: true } },
      photos: true,

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
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          startedAt: true,
          photos: { where: { role: PhotoRole.COVER }, take: 1 },
          tags: { include: { tag: true } },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  if (!project) return notFound();

  return ok({
    ...project,
    tags: project.tags.map((x) => x.tag),
    basedOn: project.basedOn ? toPreview(project.basedOn) : null,
    derivedProjects: (project.derivedProjects ?? []).map(toPreview),
  });
}
