import type { PhotoDraftState } from '@/app/_components/Form/photos/types';
import { getCoverId } from '@/app/_components/Form/photos/utils';
import { apiDelete, apiPatch, apiPost } from '@/app/_lib/request';

// ------------------------
// datetime helpers
// ------------------------
export function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

export function localInputToIso(v: string) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

// ------------------------
// Save orchestration
// ------------------------
export async function saveProjectAll(args: {
  projectId: string;

  // fields
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  startedAtLocal: string;
  finishedAtLocal: string;

  // tags
  initialTagIds: string[];
  tagIds: string[];

  // photos
  photoState: PhotoDraftState;
}) {
  const {
    projectId,
    title,
    status,
    descriptionMd,
    yarnPlan,
    startedAtLocal,
    finishedAtLocal,
    initialTagIds,
    tagIds,
    photoState,
  } = args;

  // 1) PATCH project fields
  await apiPatch(`/api/projects/${projectId}`, {
    title,
    status,
    descriptionMd,
    yarnPlan,
    startedAt: localInputToIso(startedAtLocal),
    finishedAt: localInputToIso(finishedAtLocal),
  });

  // 2) tags diff
  {
    const prev = new Set(initialTagIds);
    const next = new Set(tagIds);

    const toAdd = tagIds.filter((id) => !prev.has(id));
    const toRemove = initialTagIds.filter((id) => !next.has(id));

    for (const id of toAdd) {
      await apiPost(`/api/projects/${projectId}/tags`, { tagId: id });
    }
    for (const id of toRemove) {
      await apiDelete(`/api/projects/${projectId}/tags/${id}`);
    }
  }

  // 3) photos
  {
    const coverIdNow = getCoverId(photoState);

    // cover first
    if (coverIdNow) {
      const cover = photoState.byId[coverIdNow];
      if (cover && !cover.deleted) {
        if (cover.isTemp) {
          await apiPost(`/api/projects/${projectId}/photos`, {
            uri: cover.uri,
            caption: cover.caption,
            alt: cover.alt.trim() ? cover.alt : undefined,
            role: 'COVER',
          });
        } else {
          await apiPatch(`/api/photos/${cover.id}`, { role: 'COVER' });
        }
      }
    }

    // add temp gallery
    for (const id of photoState.order) {
      const p = photoState.byId[id];
      if (!p || p.deleted) continue;
      if (!p.isTemp) continue;
      if (p.role !== 'GALLERY') continue;

      await apiPost(`/api/projects/${projectId}/photos`, {
        uri: p.uri,
        caption: p.caption,
        alt: p.alt.trim() ? p.alt : undefined,
        role: 'GALLERY',
      });
    }

    // patch existing (fields + role)
    for (const id of photoState.order) {
      const p = photoState.byId[id];
      if (!p || p.deleted) continue;
      if (p.isTemp) continue;

      const init = p.initial;
      if (!init) continue;

      const patch: any = {};
      if (p.uri !== init.uri) patch.uri = p.uri;
      if (p.caption !== init.caption) patch.caption = p.caption;

      const altNow = p.alt.trim() ? p.alt : null;
      const altInit = init.alt.trim() ? init.alt : null;
      if (altNow !== altInit) patch.alt = altNow;

      if (p.sortOrder !== init.sortOrder) patch.sortOrder = p.sortOrder;
      if (p.role !== init.role) patch.role = p.role;

      if (Object.keys(patch).length) {
        await apiPatch(`/api/photos/${p.id}`, patch);
      }
    }

    // delete existing marked
    for (const id of photoState.order) {
      const p = photoState.byId[id];
      if (!p || p.isTemp) continue;
      if (!p.deleted) continue;
      await apiDelete(`/api/photos/${p.id}`);
    }
  }
}

export async function toggleArchive(projectId: string, isArchived: boolean) {
  if (isArchived) await apiPost(`/api/projects/${projectId}/unarchive`);
  else await apiPost(`/api/projects/${projectId}/archive`);
}
