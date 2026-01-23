export const normalizeTags = (t) => {
  return t;
};

export const collectTags = (prevTags, nextTags) => {
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

export function unifyPhotos(cover, photos) {
  const res = [];
  if (cover !== null) {
    res.push(cover);
  }
  return [...res, ...photos];
}

export function diffPhotos(initial, desired) {
  const init = new Map();
  for (const p of initial) {
    if (p?.id) {
      init.set(p.id, p);
    }
  }

  const seen = new Set<string>();
  const toCreate: any[] = [];
  const toPatch: { id: string; patch: any }[] = [];

  for (let i = 0; i < desired.length; i++) {
    const p = desired[i];

    if (!p.id && p.uri) {
      toCreate.push({
        uri: p.uri,
        caption: p.caption,
        alt: p.alt ?? null,
        role: p.role,
      });
      continue;
    }

    seen.add(p.id);
    const prev = init.get(p.id);
    if (!prev) continue;

    const patch: any = {};
    if (p.uri !== prev.uri) patch.uri = p.uri;
    if (p.caption !== prev.caption) patch.caption = p.caption;
    if ((p.alt ?? null) !== (prev.alt ?? null)) patch.alt = p.alt ?? null;
    if (p.role !== prev.role) patch.role = p.role;

    if (Object.keys(patch).length) toPatch.push({ id: p.id, patch });
  }

  const toDelete: string[] = [];
  for (const p of initial) if (!seen.has(p.id)) toDelete.push(p.id);

  return { toDelete, toCreate, toPatch };
}
