import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';

export async function deletePhoto(photoId: string) {
  if (!photoId) return badRequest('photoId required');

  const res = await prisma.photo.deleteMany({
    where: { id: photoId },
  });

  if (res.count === 0) return notFound();

  return ok({ ok: true });
}
