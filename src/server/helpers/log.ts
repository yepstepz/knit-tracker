import "server-only";
import { prisma } from "@/lib/prisma";

export async function logEntryBelongsToProject(projectId: string, logEntryId: string) {
  const entry = await prisma.projectLogEntry.findFirst({
    where: { id: logEntryId, projectId },
    select: { id: true },
  });
  return Boolean(entry);
}
