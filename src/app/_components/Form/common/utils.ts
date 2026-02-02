import { apiDelete, apiPatch, apiPost } from '@/app/_lib/request';
import type { Photo } from '@/types';

type PhotoInput = Partial<Photo> & {
  id?: string;
  uri?: string | null;
  caption?: string | null;
  alt?: string | null;
  role?: string | null;
};

type PhotoCreateInput = {
  uri: string;
  caption?: string | null;
  alt?: string | null;
  role?: string | null;
};

type PatchPhoto = { id: string; patch: Partial<Photo> };

export const normalizeTags = (t: string[]) => {
  return t;
};

export const collectTags = (prevTags: string[], nextTags: string[]) => {
  const prevSet = new Set(prevTags);
  const nextSet = new Set(nextTags);

  const added: string[] = [];
  for (const id of nextSet) {
    if (!prevSet.has(id)) {
      added.push(id);
    }
  }

  const removed: string[] = [];
  for (const id of prevSet) {
    if (!nextSet.has(id)) {
      removed.push(id);
    }
  }

  return { added, removed };
};

export function unifyPhotos(
  cover: PhotoInput | null | undefined,
  photos: Array<PhotoInput | null | undefined>,
): PhotoInput[] {
  const res: PhotoInput[] = [];
  if (cover) {
    res.push(cover);
  }
  return [...res, ...photos.filter((p): p is PhotoInput => !!p)];
}

export function diffPhotos(
  initial: Array<PhotoInput | null | undefined>,
  desired: Array<PhotoInput | null | undefined>,
): { toDelete: string[]; toCreate: PhotoCreateInput[]; toPatch: PatchPhoto[] } {
  const init = new Map<string, PhotoInput>();
  for (const p of initial) {
    if (p?.id) {
      init.set(p.id, p);
    }
  }

  const seen = new Set<string>();
  const toCreate: PhotoCreateInput[] = [];
  const toPatch: PatchPhoto[] = [];

  for (let i = 0; i < desired.length; i++) {
    const p = desired[i];
    if (!p) continue;

    if (!p.id && p.uri) {
      toCreate.push({
        uri: p.uri,
        caption: p.caption,
        alt: p.alt ?? null,
        role: p.role,
      });
      continue;
    }

    if (!p.id) continue;
    seen.add(p.id);
    const prev = init.get(p.id);
    if (!prev) continue;

    const patch: Partial<Photo> = {};
    if (p.uri !== prev.uri) patch.uri = p.uri;
    if (p.caption !== prev.caption) patch.caption = p.caption;
    if ((p.alt ?? null) !== (prev.alt ?? null)) patch.alt = p.alt ?? null;
    if (p.role !== prev.role) patch.role = p.role;

    if (Object.keys(patch).length) toPatch.push({ id: p.id, patch });
  }

  const toDelete: string[] = [];
  for (const p of initial) {
    if (!p?.id) continue;
    if (!seen.has(p.id) && p.uri) toDelete.push(p.id);
  }

  return { toDelete, toCreate, toPatch };
}

export async function deletePhotos(photoIds: string[]) {
  for (const id of photoIds) {
    await apiDelete(`/api/photos/${id}`);
  }
}

export async function createPhotos({
  projectId,
  logEntryId,
  photos,
}: {
  projectId: string;
  logEntryId?: string;
  photos: PhotoCreateInput[];
}) {
  let url = `/api/projects/${projectId}/photos`;
  if (logEntryId !== undefined) {
    url = `/api/projects/${projectId}/log/${logEntryId}/photos`;
  }
  for (const p of photos) {
    await apiPost(url, {
      uri: p.uri,
      caption: p.caption,
      alt: p.alt ?? null,
      role: p.role,
    });
  }
}

export async function patchPhotos(photos: PatchPhoto[]) {
  for (const p of photos) {
    await apiPatch(`/api/photos/${p.id}`, p.patch);
  }
}

export async function processPhotos({
  toCreate,
  toPatch,
  toDelete,
  projectId,
  logEntryId,
}: {
  toCreate: PhotoCreateInput[];
  toPatch: PatchPhoto[];
  toDelete: string[];
  projectId: string;
  logEntryId?: string;
}) {
  return Promise.all([
    deletePhotos(toDelete),
    createPhotos({ projectId, logEntryId, photos: toCreate }),
    patchPhotos(toPatch),
  ]);
}
