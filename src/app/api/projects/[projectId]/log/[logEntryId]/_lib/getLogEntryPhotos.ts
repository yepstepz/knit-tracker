import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";
import { logEntryBelongsToProject } from "@/server/helpers/log";

export async function getLogEntryPhotos(projectId: string, logEntryId: string) {
  if (!projectId || !logEntryId) {
    return badRequest("projectId and logEntryId required");
  }

  const belongs = await logEntryBelongsToProject(projectId, logEntryId);
  if (!belongs) return notFound();

  const photos = await prisma.photo.findMany({
    where: { logEntryId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return ok(photos);
}
