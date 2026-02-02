import type { ProjectStatus } from '@prisma/client';
import type { ImageValue } from '@/app/_components/Form/common/ImageField/utils';

export type ProjectFormMode =
  | { kind: 'edit'; projectId: string; redirectTo?: string }
  | { kind: 'create'; redirectTo?: (projectId: string) => string };

export type ProjectFormValues = {
  title: string;
  status: ProjectStatus;
  archived: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  tags: string[];
  descriptionMd: string;
  yarnPlan: string;
  cover: ImageValue | null;
  photos: ImageValue[];
};
