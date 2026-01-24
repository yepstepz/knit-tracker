import { useForm } from './form-context';
import { ProjectStatus } from '@prisma/client';
import { ACTIVE } from '@/app/_components/Form/project/const';

export const projectForm = (project) => {
  return useForm({
    mode: 'controlled',
    initialValues: {
      title: project.title ?? '',
      status: ((project.status as ProjectStatus) ?? ACTIVE) as ProjectStatus,
      archived: project.archivedAt !== null,
      startedAt: project.startedAt,
      finishedAt: project.finishedAt,
      tags: (project.tags ?? []).map((t) => t.name),
      descriptionMd: project.descriptionMd,
      yarnPlan: project.yarnPlan,
      cover: project.cover,
      photos: project.photos,
    },
    validate: {
      title: (v) => (v.trim() ? null : 'Title is required'),
    },
  });
};
