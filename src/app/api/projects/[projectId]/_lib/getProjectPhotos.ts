import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';

export async function getProjectPhotos(projectId: string) {
  if (!projectId) return badRequest('[projectId] required');

  // опционально, но полезно: 404 если проекта нет
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!project) return notFound('project not found');

  const photos = await prisma.photo.findMany({
    where: { projectId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return ok(photos);
}
