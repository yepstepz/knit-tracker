import { apiGetCached } from '@/app/_lib/request';
import type { ProjectDetail } from '@/types';
import { ProjectPageClient } from './project-page-client';
import { fmtDate } from '../../_lib/format';

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  const projectApi = await apiGetCached<ProjectDetail>(`/api/projects/${projectId}`, {
    revalidate: 60 * 60 * 24 * 7,
  });

  const toLabel = (v: string | null | undefined) => fmtDate(v) ?? '—';

  const logs = projectApi.logEntries.map((log) => ({
    ...log,
    contentMd: log.contentMd.trim(),
    happenedAt: toLabel(log.happenedAt),
  }));

  const isArchived = projectApi.archivedAt != null;
  const project = {
    ...projectApi,
    createdAt: toLabel(projectApi.createdAt),
    updatedAt: toLabel(projectApi.updatedAt),
    startedAt: toLabel(projectApi.startedAt),
    finishedAt: toLabel(projectApi.finishedAt),
    archivedAt: toLabel(projectApi.archivedAt),
    logEntries: logs,
  };

  return <ProjectPageClient projectId={projectId} project={project} isArchived={isArchived} />;
}
