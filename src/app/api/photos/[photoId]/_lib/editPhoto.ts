import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';
import { isPhotoRole } from '@/server/helpers/photo';
import { PhotoRole } from '@prisma/client';
import { revalidateProjectsList, revalidateProjectDetail, revalidateLogsList } from '@/lib/cache-paths';

type Body = Partial<{
  uri: string;
  caption: string | null;
  alt: string | null;
  role: PhotoRole | string;
  sortOrder: number;
}>;

export async function editPhoto(photoId: string, body: unknown) {
  if (!photoId) return badRequest('photoId required');
  if (!body || typeof body !== 'object') return badRequest('invalid json');

  const b = body as Body;
  const data: any = {};

  if ('uri' in b) {
    const uri = typeof b.uri === 'string' ? b.uri.trim() : '';
    if (!uri) return badRequest('uri must be non-empty');
    data.uri = uri;
  }

  if ('caption' in b) {
    if (b.caption !== null && typeof b.caption !== 'string') {
      return badRequest('caption must be string or null');
    }
    data.caption = b.caption;
  }

  if ('alt' in b) {
    if (b.alt !== null && typeof b.alt !== 'string') {
      return badRequest('alt must be string or null');
    }
    data.alt = b.alt;
  }

  let wantsCover = false;
  if ('role' in b) {
    if (typeof b.role !== 'string' || !isPhotoRole(b.role)) {
      return badRequest('role must be a valid PhotoRole');
    }
    data.role = b.role as PhotoRole;
    wantsCover = data.role === PhotoRole.COVER;
  }

  if ('sortOrder' in b) {
    if (typeof b.sortOrder !== 'number' || !Number.isFinite(b.sortOrder)) {
      return badRequest('sortOrder must be number');
    }
    data.sortOrder = Math.trunc(b.sortOrder);
  }

  if (Object.keys(data).length === 0) {
    return badRequest('no fields to update');
  }

  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.photo.findUnique({
      where: { id: photoId },
      select: { id: true, projectId: true, logEntryId: true },
    });
    if (!current) return null;

    if (wantsCover) {
      // если фото не принадлежит проекту - не сбрасываем
      if (current.projectId) {
        await tx.photo.updateMany({
          where: {
            projectId: current.projectId,
            role: PhotoRole.COVER,
            NOT: { id: photoId },
          },
          data: { role: PhotoRole.GALLERY },
        });
      }
    }

    await tx.photo.update({
      where: { id: photoId },
      data,
    });

    const updated = await tx.photo.findUnique({ where: { id: photoId } });
    return { updated, current };
  });

  if (!result) return notFound();

  if (result.current.projectId) {
    revalidateProjectsList();
    revalidateProjectDetail(result.current.projectId);
  }
  if (result.current.logEntryId) {
    revalidateLogsList(result.current.projectId ?? null);
    revalidateProjectDetail(result.current.projectId ?? null);
  }

  return ok(result.updated);
}
