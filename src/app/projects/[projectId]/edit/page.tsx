import { notFound } from 'next/navigation';
import { apiGet } from '@/app/_lib/request';
import type { ProjectDetail, Tag } from '@/types';

import EditProjectClient from './edit-project-client';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  let project: ProjectDetail;
  let allTags: Tag[];

  try {
    [project, allTags] = await Promise.all([
      apiGet<ProjectDetail>(`/api/projects/${projectId}`),
      apiGet<Tag[]>(`/api/tags`),
    ]);
  } catch {
    notFound();
  }

  return (
    <EditProjectClient
      projectId={projectId}
      project={project}
      allTags={allTags}
      backHref={`/projects/${projectId}`}
      redirectTo={`/projects/${projectId}`}
    />
  );
}
