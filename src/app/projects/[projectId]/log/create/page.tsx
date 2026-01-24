import { notFound } from 'next/navigation';
import { apiGet } from '@/app/_lib/request';
import type { LogEntry, ProjectDetail } from '@/types';
import CreateLogClient from '@/app/projects/[projectId]/log/create/create-log.client';

export default async function CreateLogEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; logEntryId: string }>;
}) {
  const { projectId } = await params;
  const { backTo } = await searchParams;

  console.log({ backTo });

  let project: ProjectDetail;

  try {
    [project] = await Promise.all([apiGet<ProjectDetail>(`/api/projects/${projectId}`)]);
  } catch {
    notFound();
  }

  return <CreateLogClient project={project} redirectTo={backTo} />;
}
