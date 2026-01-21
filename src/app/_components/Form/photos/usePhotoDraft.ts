"use client";

import { useMemo, useState } from "react";
import type { Photo, PhotoDraftState } from "./types";
import { addTempPhoto, buildPhotoDraft, getCoverId, removeTemp, setCover } from "./utils";

export function usePhotoDraft(initialPhotos: Photo[]) {
  const [state, setState] = useState<PhotoDraftState>(() => buildPhotoDraft(initialPhotos));

  const coverId = useMemo(() => getCoverId(state), [state]);
  const cover = useMemo(() => (coverId ? state.byId[coverId] ?? null : null), [state, coverId]);

  const update = (
    id: string,
    patch: Partial<{ uri: string; caption: string; alt: string; sortOrder: number }>
  ) => {
    setState((prev) => {
      const next = structuredClone(prev);
      const p = next.byId[id];
      if (!p || p.deleted) return prev;
      if (patch.uri !== undefined) p.uri = patch.uri;
      if (patch.caption !== undefined) p.caption = patch.caption;
      if (patch.alt !== undefined) p.alt = patch.alt;
      if (patch.sortOrder !== undefined) p.sortOrder = patch.sortOrder;
      return next;
    });
  };

  const setCoverId = (id: string) => {
    setState((prev) => {
      const next = structuredClone(prev);
      const p = next.byId[id];
      if (!p || p.deleted) return prev;
      setCover(next, id);
      return next;
    });
  };

  const toggleDeleteExisting = (id: string) => {
    setState((prev) => {
      const next = structuredClone(prev);
      const p = next.byId[id];
      if (!p || p.isTemp) return prev;
      p.deleted = !p.deleted;
      return next;
    });
  };

  const removeTempById = (id: string) => {
    setState((prev) => {
      const next = structuredClone(prev);
      const p = next.byId[id];
      if (!p || !p.isTemp) return prev;
      removeTemp(next, id);
      return next;
    });
  };

  const addGallery = (input: { uri: string; caption: string; alt: string }) => {
    const uri = input.uri.trim();
    const caption = input.caption.trim();
    if (!uri || !caption) return false;

    setState((prev) => {
      const next = structuredClone(prev);
      addTempPhoto(next, { uri, caption, alt: input.alt, role: "GALLERY", sortOrder: 0 });
      return next;
    });

    return true;
  };

  const addCoverReplace = (input: { uri: string; caption: string; alt: string }) => {
    const uri = input.uri.trim();
    const caption = input.caption.trim();
    if (!uri || !caption) return false;

    setState((prev) => {
      const next = structuredClone(prev);
      const id = addTempPhoto(next, { uri, caption, alt: input.alt, role: "COVER", sortOrder: 0 });
      setCover(next, id);
      return next;
    });

    return true;
  };

  return {
    state,
    coverId,
    cover,
    update,
    setCoverId,
    toggleDeleteExisting,
    removeTempById,
    addGallery,
    addCoverReplace,
  };
}
