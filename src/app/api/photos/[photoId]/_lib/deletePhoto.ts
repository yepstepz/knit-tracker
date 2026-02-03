import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';
import { revalidateProjectsList, revalidateProjectDetail, revalidateLogsList } from '@/lib/cache-paths';

export async function deletePhoto(photoId: string) {
  if (!photoId) return badRequest('photoId required');

  try {
    const current = await prisma.photo.delete({
      where: { id: photoId },
      select: { id: true, projectId: true, logEntryId: true },
    });

    if (current.projectId) {
      revalidateProjectsList();
      revalidateProjectDetail(current.projectId);
    }
    if (current.logEntryId) {
      let projectId = current.projectId ?? null;
      if (!projectId) {
        const log = await prisma.projectLogEntry.findUnique({
          where: { id: current.logEntryId },
          select: { projectId: true },
        });
        projectId = log?.projectId ?? null;
      }
      revalidateLogsList(projectId);
      revalidateProjectDetail(projectId);
    }

    return ok({ ok: true });
  } catch {
    return notFound();
  }
}
