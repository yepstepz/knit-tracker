import type { ProjectStatus } from '@prisma/client';
import { ProjectDetail } from '@/types';

export const IDEA = 'IDEA';
export const ACTIVE = 'ACTIVE';
export const PAUSED = 'PAUSED';
export const FINISHED = 'FINISHED';
export const ABANDONED = 'ABANDONED';

export const projectStatus = {
  IDEA,
  ACTIVE,
  PAUSED,
  FINISHED,
  ABANDONED,
};

export const emptyProject = {
  title: '',
  status: IDEA as ProjectStatus,
  archived: false,
  startedAt: null,
  finishedAt: null,
  tags: [],
  descriptionMd: '',
  yarnPlan: '',
  cover: null,
  photos: [],
};

export const defaultCover = { uri: '', caption: '', alt: '', role: 'GALLERY' };
