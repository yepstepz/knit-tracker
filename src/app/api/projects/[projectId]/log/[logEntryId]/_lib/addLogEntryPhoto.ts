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
  if (!projectId || !logEntryId) {
    return badRequest("projectId and logEntryId required");
  }

  const belongs = await logEntryBelongsToProject(projectId, logEntryId);
  if (!belongs) return notFound();

  const parsed = await parseCreatePhotoInput(body, {
    orderScope: { logEntryId },
  });
  if (!parsed.ok) return badRequest(parsed.error);

  const photo = await prisma.photo.upsert({
    where: { logEntryId },
    update: {
      ...parsed.value, // uri, caption, alt(default=caption), role, sortOrder
    },
    create: {
      logEntryId,
      ...parsed.value,
    },
  });

  return created(photo);
}
