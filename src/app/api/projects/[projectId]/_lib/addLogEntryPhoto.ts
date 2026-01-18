import "server-only";
import { prisma } from "@/lib/prisma";
import { created, badRequest, notFound } from "@/server/helpers/http";
import { parseCreatePhotoInput } from "@/server/helpers/photo";
import { logEntryBelongsToProject } from "@/server/helpers/log";

export async function addLogEntryPhoto(
  projectId: string,
  logEntryId: string,
  body: unknown
) {
  if (!projectId || !logEntryId) return badRequest("[projectId] and logEntryId required");

  const okBelongs = await logEntryBelongsToProject(projectId, logEntryId);
  if (!okBelongs) return notFound();

  const parsed = await parseCreatePhotoInput(body, {
    orderScope: { logEntryId },
  });

  if (!parsed.ok) return badRequest(parsed.error);

  const photo = await prisma.photo.create({
    data: {
      logEntryId,
      ...parsed.value,
    },
  });

  return created(photo);
}
