import { notFound } from 'next/navigation';
import { apiGet } from '@/app/_lib/request';
import type { LogEntry, ProjectDetail } from '@/types';
import { LogEntryFormClient } from '@/app/_components/Form/log/LogEntryFormClient';

export default async function EditLogEntryPage({
  params,
}: {
  params: Promise<{ projectId: string; logEntryId: string }>;
}) {
  const { projectId, logEntryId } = await params;

  let project: ProjectDetail;
  let entry: LogEntry;

  try {
    [project, entry] = await Promise.all([
      apiGet<ProjectDetail>(`/api/projects/${projectId}`),
      apiGet<LogEntry>(`/api/projects/${projectId}/log/${logEntryId}`),
    ]);
  } catch {
    notFound();
  }

  return (
    <LogEntryFormClient
      mode={{ kind: 'edit', logEntryId, redirectTo: `/projects/${projectId}/log/${logEntryId}` }}
      projectId={projectId}
      projectTitle={project.title}
      projectStatus={project.status}
      projectArchivedAt={project.archivedAt}
      initial={{
        title: entry.title,
        contentMd: entry.contentMd ?? '',
        happenedAt: entry.happenedAt,
        photo: entry.photo
          ? {
              id: entry.photo.id,
              uri: entry.photo.uri,
              caption: entry.photo.caption,
              alt: entry.photo.alt ?? null,
              sortOrder: entry.photo.sortOrder ?? 0,
              role: entry.photo.role,
            }
          : null,
      }}
    />
  );
}
