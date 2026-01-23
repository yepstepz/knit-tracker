import type { Photo, DraftPhoto, PhotoDraftState, PhotoRole } from './types';

export function makeTempId() {
  // браузер
  // @ts-ignore
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `tmp_${crypto.randomUUID()}`;
  return `tmp_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function toAltString(v?: string | null) {
  return v ?? '';
}

export function toSortOrder(v?: number | null) {
  return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
}

export function buildPhotoDraft(photos: Photo[]): PhotoDraftState {
  const byId: Record<string, DraftPhoto> = {};
  const order: string[] = [];

  for (const p of photos) {
    const dp: DraftPhoto = {
      id: p.id,
      isTemp: false,
      uri: p.uri,
      caption: p.caption,
      alt: toAltString(p.alt),
      role: p.role,
      sortOrder: toSortOrder(p.sortOrder),
      initial: {
        uri: p.uri,
        caption: p.caption,
        alt: toAltString(p.alt),
        role: p.role,
        sortOrder: toSortOrder(p.sortOrder),
      },
    };
    byId[p.id] = dp;
    order.push(p.id);
  }

  return { order, byId };
}

export function getCoverId(state: PhotoDraftState): string | null {
  for (const id of state.order) {
    const p = state.byId[id];
    if (!p) continue;
    if (p.deleted) continue;
    if (p.role === 'COVER') return id;
  }
  return null;
}
