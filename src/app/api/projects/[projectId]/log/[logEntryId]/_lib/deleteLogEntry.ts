import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";

export async function deleteLogEntry(projectId: string, logEntryId: string) {
  if (!projectId || !logEntryId) {
    return badRequest("projectId and logEntryId required");
  }

  // deleteMany — чтобы:
  // 1) не падать, если записи нет
  // 2) гарантировать совпадение projectId (нельзя удалить запись другого проекта)
  const res = await prisma.projectLogEntry.deleteMany({
    where: { id: logEntryId, projectId },
  });

  if (res.count === 0) return notFound();

  return ok({ ok: true });
}
