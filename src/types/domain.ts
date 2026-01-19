export type Tag = {
  id: string;
  name: string;
  color?: string | null;
};

export type Photo = {
  id: string;
  uri: string;
  caption?: string | null;
  alt?: string | null;
  role?: string | null;
};

export type LogPhoto = {
  uri: string;
  alt?: string | null;
  caption?: string | null;
};

export type LogEntry = {
  id: string;
  happenedAt: string;
  title: string;
  contentMd: string;
  photo?: LogPhoto | null;
};

export type ProjectListItem = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  tags: Tag[];
  cover: Photo | null;
};

export type ProjectMini = {
  id: string;
  title: string;
  status: string;
  archivedAt: string | null;
};

export type ProjectDetail = {
  id: string;
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  archivedAt: string | null;

  tags: any;
  cover?: Photo | null;
  photos?: Photo[];
  logEntries: LogEntry[];
};
