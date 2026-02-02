import { notFound } from 'next/navigation';
import { apiGet } from '@/app/_lib/request';
import type { LogEntry, ProjectDetail } from '@/types';
import CreateLogClient from '@/app/projects/[projectId]/log/create/create-log.client';

export default async function CreateLogEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<{ backTo?: string }>;
}) {
  const { projectId } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const backTo = sp?.backTo ?? `/projects/${projectId}/log?page=1&limit=10`;

  let project: ProjectDetail;

  try {
    [project] = await Promise.all([apiGet<ProjectDetail>(`/api/projects/${projectId}`)]);
  } catch {
    notFound();
  }

  return <CreateLogClient project={project} redirectTo={backTo} />;
}
