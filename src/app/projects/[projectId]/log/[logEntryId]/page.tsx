import { notFound } from 'next/navigation';
import { apiGetCached } from '@/app/_lib/request';
import { fmtDate } from '@/app/_lib/format';
import type { LogEntry, ProjectDetail } from '@/types';
import LogEntryClient from './log-entry-client';

export default async function LogEntryPage({
  params,
}: {
  params: Promise<{ projectId: string; logEntryId: string }>;
}) {
  const { projectId, logEntryId } = await params;

  let project: ProjectDetail;
  let entry: LogEntry;

  try {
    [project, entry] = await Promise.all([
      apiGetCached<ProjectDetail>(`/api/projects/${projectId}`, {
        revalidate: 60 * 60 * 24 * 7,
      }),
      apiGetCached<LogEntry>(`/api/projects/${projectId}/log/${logEntryId}`, {
        revalidate: 60 * 60 * 24,
      }),
    ]);
  } catch {
    notFound();
  }

  const happenedAtLabel = fmtDate(entry.happenedAt) ?? '—';

  return (
    <LogEntryClient
      projectId={projectId}
      logEntryId={logEntryId}
      projectTitle={project.title}
      entry={entry}
      happenedAtLabel={happenedAtLabel}
      redirectTo={`/projects/${projectId}/log?page=1&limit=10`}
    />
  );
}
