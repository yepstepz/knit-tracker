import "server-only";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, notFound } from "@/server/helpers/http";

type EditLogEntryBody = Partial<{
  title: string;
  contentMd: string | null;
  happenedAt: string; // ISO string
}>;

function toDateOrUndefined(value: unknown) {
  if (value === undefined) return undefined; // поле не прислали
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function editLogEntry(
  projectId: string,
  logEntryId: string,
  body: unknown
) {
  if (!projectId || !logEntryId) {
    return badRequest("projectId and logEntryId required");
  }

  if (!body || typeof body !== "object") {
    return badRequest("invalid json");
  }

  const b = body as EditLogEntryBody;
  const data: any = {};

  if ("title" in b) {
    const title = typeof b.title === "string" ? b.title.trim() : "";
    if (!title) return badRequest("title must be non-empty");
    data.title = title;
  }

  if ("contentMd" in b) {
    if (b.contentMd !== null && typeof b.contentMd !== "string") {
      return badRequest("contentMd must be string or null");
    }
    data.contentMd = b.contentMd ?? "";
  }

  if ("happenedAt" in b) {
    const d = toDateOrUndefined((b as any).happenedAt);
    if (d === null) return badRequest("happenedAt must be ISO date string");
    if (d === undefined) {
      // это возможно только если happenedAt: undefined, но мы попали в ветку "in",
      // оставим как no-op
    } else {
      data.happenedAt = d;
    }
  }

  if (Object.keys(data).length === 0) {
    return badRequest("no fields to update");
  }

  // защита: нельзя редактировать запись другого проекта
  const updated = await prisma.projectLogEntry.updateMany({
    where: { id: logEntryId, projectId },
    data,
  });

  if (updated.count === 0) return notFound();

  const entry = await prisma.projectLogEntry.findUnique({
    where: { id: logEntryId },
    include: { photos: true },
  });

  // теоретически entry может быть null только если запись удалили между запросами
  if (!entry) return notFound();

  return ok(entry);
}
