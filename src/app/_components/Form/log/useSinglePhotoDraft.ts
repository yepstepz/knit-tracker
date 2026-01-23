'use client';

import { useMemo, useState } from 'react';
import type { LogPhoto } from '@/types';

export function useSinglePhotoDraft(initial: LogPhoto | null | undefined) {
  const hasInitial = !!initial;

  const [deleted, setDeleted] = useState(false);

  // edit existing photo fields
  const [edit, setEdit] = useState(() => ({
    uri: initial?.uri ?? '',
    caption: initial?.caption ?? '',
    alt: initial?.alt ?? '',
  }));

  // draft new photo fields (only used if no initial)
  const [draft, setDraft] = useState(() => ({
    uri: '',
    caption: '',
    alt: '',
  }));

  const canPreview = useMemo(() => {
    if (hasInitial) return !deleted && !!edit.uri;
    return !!draft.uri.trim() && !!draft.caption.trim();
  }, [hasInitial, deleted, edit.uri, draft.uri, draft.caption]);

  const previewUri = useMemo(() => {
    if (!canPreview) return '';
    return hasInitial ? edit.uri : draft.uri.trim();
  }, [canPreview, hasInitial, edit.uri, draft.uri]);

  const previewAlt = useMemo(() => {
    if (!canPreview) return '';
    if (hasInitial) return edit.alt || edit.caption || 'Photo';
    return draft.alt || draft.caption || 'Photo';
  }, [canPreview, hasInitial, edit.alt, edit.caption, draft.alt, draft.caption]);

  return {
    hasInitial,
    initial: initial ?? null,
    deleted,
    setDeleted,

    edit,
    setEdit,

    draft,
    setDraft,

    canPreview,
    previewUri,
    previewAlt,
  };
}
