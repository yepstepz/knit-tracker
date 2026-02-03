import type { ProjectStatus } from '@prisma/client';
import type { ImageValue } from '@/app/_components/Form/common/ImageField/utils';
import type { ProjectDetail } from '@/types';

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

export const defaultCover: ImageValue = { uri: '', caption: '', alt: '', role: 'GALLERY' };
