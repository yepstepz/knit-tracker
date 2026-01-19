import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";
import { logEntryBelongsToProject } from "@/server/helpers/log";

export async function getLogEntry(projectId: string, logEntryId: string) {
  if (!projectId || !logEntryId) {
    return badRequest("projectId and logEntryId required");
  }

  const belongs = await logEntryBelongsToProject(projectId, logEntryId);
  if (!belongs) return notFound();

  const entry = await prisma.projectLogEntry.findUnique({
    where: { id: logEntryId },
    include: { photo: true }, // one-to-one
  });

  if (!entry) return notFound();

  return ok(entry);
}
