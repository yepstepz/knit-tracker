import { ProjectStatus } from '@prisma/client';
import { ACTIVE } from '@/app/_components/Form/project/const';
import type { ProjectDetail, Tag, Photo } from '@/types';
import type { ProjectFormValues } from '@/app/_components/Form/project/types';
import type { ImageValue } from '@/app/_components/Form/common/ImageField/utils';
import { useForm } from './form-context';

const normalizePhoto = (photo?: Photo | null): ImageValue => ({
  id: photo?.id,
  uri: photo?.uri ?? '',
  caption: photo?.caption ?? '',
  alt: photo?.alt ?? '',
  role: (photo?.role ?? undefined) as ImageValue['role'],
});

export const projectForm = (project: Partial<ProjectDetail>) => {
  return useForm({
    mode: 'controlled',
    initialValues: {
      title: project.title ?? '',
      status: (project.status ?? ACTIVE) as ProjectStatus,
      archived: project.archivedAt !== null,
      startedAt: project.startedAt ?? null,
      finishedAt: project.finishedAt ?? null,
      tags: (project.tags ?? []).map((t: Tag) => t.name),
      descriptionMd: project.descriptionMd ?? '',
      yarnPlan: project.yarnPlan ?? '',
      cover: project.cover ? normalizePhoto(project.cover) : null,
      photos: (project.photos ?? []).map((photo) => normalizePhoto(photo)),
    },
    validate: {
      title: (v: ProjectFormValues['title']) => (v.trim() ? null : 'Title is required'),
    },
  });
};
