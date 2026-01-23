'use client';

import { useMemo, useState } from 'react';

export type BasePhoto = {
  id: string;
  uri: string;
  caption: string;
  alt: string | null;
  sortOrder?: number | null;
};

export type DraftInput = {
  uri: string;
  caption: string;
  alt: string;
  sortOrder?: number | null;
};

type DraftItem =
  | {
      kind: 'existing';
      id: string;
      uri: string;
      caption: string;
      alt: string;
      sortOrder?: number | null;
    }
  | {
      kind: 'new';
      tempId: string;
      uri: string;
      caption: string;
      alt: string;
      sortOrder?: number | null;
    };

const makeTempId = () => `tmp_${Math.random().toString(16).slice(2)}`;

const keyOf = (x: DraftItem) => (x.kind === 'existing' ? x.id : x.tempId);

const normAlt = (a: string | null | undefined) => {
  const s = (a ?? '').trim();
  return s ? s : null;
};

function asDraftItem(p: BasePhoto): DraftItem {
  return {
    kind: 'existing',
    id: p.id,
    uri: p.uri ?? '',
    caption: p.caption ?? '',
    alt: p.alt ?? '',
    sortOrder: p.sortOrder ?? 0,
  };
}

export function usePhotoDraft(
  args: { kind: 'single'; initial: BasePhoto | null } | { kind: 'many'; initial: BasePhoto[] },
) {
  const initialList = args.kind === 'single' ? (args.initial ? [args.initial] : []) : args.initial;

  // map initial for diff
  const initialMap = useMemo(() => {
    const m = new Map<
      string,
      { uri: string; caption: string; alt: string | null; sortOrder?: number | null }
    >();
    for (const p of initialList) {
      m.set(p.id, {
        uri: p.uri,
        caption: p.caption,
        alt: normAlt(p.alt),
        sortOrder: p.sortOrder ?? 0,
      });
    }
    return m;
    // initialList intentionally captured once (draft is per-page lifetime)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [items, setItems] = useState<DraftItem[]>(initialList.map(asDraftItem));
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // actions
  const add = (p: DraftInput) => {
    const next: DraftItem = { kind: 'new', tempId: makeTempId(), ...p };
    setItems((s) => [next, ...s]);
  };

  const update = (key: string, patch: Partial<DraftInput>) => {
    setItems((s) => s.map((x) => (keyOf(x) === key ? ({ ...x, ...patch } as DraftItem) : x)));
  };

  const remove = (key: string) => {
    const existing = items.find((x) => x.kind === 'existing' && x.id === key);
    if (existing) setDeletedIds((prev) => new Set([...prev, key]));

    setItems((s) => s.filter((x) => keyOf(x) !== key));

    // in single mode this is equivalent to "clear + delete initial"
    if (args.kind === 'single') {
      setDeletedIds(new Set(initialList.map((x) => x.id)));
    }
  };

  // single helpers
  const setSingleDraft = (p: DraftInput) => {
    const next: DraftItem = { kind: 'new', tempId: makeTempId(), ...p };
    setItems([next]);
    setDeletedIds(new Set(initialList.map((x) => x.id)));
  };

  const clearSingle = () => {
    setItems([]);
    setDeletedIds(new Set(initialList.map((x) => x.id)));
  };

  // derived preview (simple)
  const preview = useMemo(() => {
    if (args.kind === 'single') {
      const x = items[0];
      if (!x) return { uri: '', alt: '' };
      const uri = x.uri?.trim() ?? '';
      const cap = x.caption ?? '';
      const alt = (x.alt || cap || 'Photo') as string;
      return { uri, alt };
    }
    return { uri: '', alt: '' };
  }, [args.kind, items]);

  const plan = useMemo(() => {
    const create: Array<{
      tempId: string;
      uri: string;
      caption: string;
      alt: string | null;
      sortOrder?: number | null;
    }> = [];
    const patch: Array<{ id: string; patch: any }> = [];
    const del: string[] = Array.from(deletedIds);

    for (const x of items) {
      const alt = normAlt(x.alt);

      if (x.kind === 'new') {
        const uri = x.uri.trim();
        const caption = x.caption.trim();
        if (!uri || !caption) continue;
        create.push({ tempId: x.tempId, uri, caption, alt, sortOrder: x.sortOrder ?? 0 });
        continue;
      }

      const init = initialMap.get(x.id);
      if (!init) continue;

      const p: any = {};
      if (x.uri !== init.uri) p.uri = x.uri;
      if (x.caption !== init.caption) p.caption = x.caption;

      const altNow = alt;
      const altInit = init.alt;
      if (altNow !== altInit) p.alt = altNow;

      const soNow = x.sortOrder ?? 0;
      const soInit = init.sortOrder ?? 0;
      if (soNow !== soInit) p.sortOrder = soNow;

      if (Object.keys(p).length) patch.push({ id: x.id, patch: p });
    }

    if (args.kind === 'single') {
      return { create: create.slice(0, 1), patch: patch.slice(0, 1), delete: del };
    }
    return { create, patch, delete: del };
  }, [args.kind, deletedIds, initialMap, items]);

  return {
    kind: args.kind,
    items,
    add,
    update,
    remove,
    setItems,

    // single helpers
    setSingleDraft,
    clearSingle,

    preview,
    getPlan: () => plan,
  };
}
