export type PhotoRole = 'COVER' | 'GALLERY';

export type Photo = {
  id: string;
  uri: string;
  caption: string;
  alt?: string | null;
  role: PhotoRole;
  sortOrder?: number | null;
};

export type DraftPhoto = {
  id: string; // real id или temp id
  isTemp: boolean;
  deleted?: boolean; // только для existing
  // current fields:
  uri: string;
  caption: string;
  alt: string; // в UI держим строку, на API -> null/undefined
  role: PhotoRole;
  sortOrder: number;

  // initial snapshot for existing to compute PATCH
  initial?: {
    uri: string;
    caption: string;
    alt: string;
    role: PhotoRole;
    sortOrder: number;
  };
};

export type PhotoDraftState = {
  order: string[]; // порядок карточек
  byId: Record<string, DraftPhoto>; // и temp, и existing
};
