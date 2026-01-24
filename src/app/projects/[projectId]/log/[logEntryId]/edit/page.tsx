import { notFound } from 'next/navigation';
import { apiGet } from '@/app/_lib/request';
import type { LogEntry, ProjectDetail } from '@/types';
import EditProjectClient from '@/app/projects/[projectId]/log/[logEntryId]/edit/edit-log.client';

export default async function EditLogEntryPage({
  params,
}: {
  params: Promise<{ projectId: string; logEntryId: string }>;
}) {
  const { projectId, logEntryId } = await params;

  let project: ProjectDetail;
  let log: LogEntry;

  try {
    [project, log] = await Promise.all([
      apiGet<ProjectDetail>(`/api/projects/${projectId}`),
      apiGet<LogEntry>(`/api/projects/${projectId}/log/${logEntryId}`),
    ]);
  } catch {
    notFound();
  }

  return <EditProjectClient project={project} logEntryId={logEntryId} log={log} />;
}
