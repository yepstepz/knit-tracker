import "server-only";
import { prisma } from "@/lib/prisma";
import { PhotoRole } from "@prisma/client";
import { nonEmptyString, optionalInt, optionalStringOrNull } from "./validators";

export type PhotoParsedInput = {
  uri: string;
  caption: string | null;
  alt: string | null;
  role: PhotoRole;
  sortOrder: number;
};

export function isPhotoRole(v: string): v is PhotoRole {
  // ⚠️ Подстрой под свой enum, если отличается
  return v === "COVER" || v === "GALLERY" || v === "LOG";
}

export async function nextPhotoSortOrder(where: { projectId?: string; logEntryId?: string }) {
  const agg = await prisma.photo.aggregate({
    where,
    _max: { sortOrder: true },
  });
  return (agg._max.sortOrder ?? 0) + 1;
}

/**
 * Общий парсер входа для create фото.
 * - alt defaults to caption (если alt не передали)
 * - sortOrder: если не передали -> в конец (max+1) в рамках projectId или logEntryId
 */
export async function parseCreatePhotoInput(
  body: unknown,
  opts: {
    defaultRole?: PhotoRole;
    orderScope: { projectId?: string; logEntryId?: string };
  }
): Promise<{ ok: true; value: PhotoParsedInput } | { ok: false; error: string }> {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid json" };

  const b = body as any;

  const uri = nonEmptyString(b.uri);
  if (!uri) return { ok: false, error: "uri required" };

  const caption = optionalStringOrNull(b.caption); // null если не строка/не задано
  const altRaw = b.alt;

  // ✅ alt по умолчанию = caption, если alt не передали
  const alt =
    altRaw === null
      ? null
      : typeof altRaw === "string"
        ? altRaw
        : caption;

  let role = opts.defaultRole ?? PhotoRole.GALLERY;
  if (b.role !== undefined) {
    if (typeof b.role !== "string" || !isPhotoRole(b.role)) {
      return { ok: false, error: "role must be a valid PhotoRole" };
    }
    role = b.role as PhotoRole;
  }

  const sortOrderProvided = optionalInt(b.sortOrder);
  const sortOrder =
    sortOrderProvided ?? (await nextPhotoSortOrder(opts.orderScope));

  return { ok: true, value: { uri, caption, alt, role, sortOrder } };
}
