import { apiGet } from '@/app/_lib/request';
import { qs } from '@/app/_lib/qs';
import { fmtDate, markdownPreview } from '@/app/_lib/format';
import type { LogEntry, Paginated, ProjectDetail } from '@/types';
import ProjectLogClient from './log-client';

export default async function ProjectLogPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;

  const page = Number(sp.page ?? '1') || 1;
  const limit = sp.limit ?? '10';

  const [project, logs] = await Promise.all([
    apiGet<ProjectDetail>(`/api/projects/${projectId}`),
    apiGet<Paginated<LogEntry>>(
      `/api/projects/${projectId}/log${qs({ page: String(page), limit })}`,
    ),
  ]);

  const backTo = `/projects/${projectId}/log${qs({ page: String(page), limit })}`;

  const items = logs.items.map((e) => ({
    id: e.id,
    title: e.title,
    happenedAtLabel: fmtDate(e.happenedAt) ?? '—',
    photo: e.photo ? { uri: e.photo.uri, alt: e.photo.alt ?? e.photo.caption ?? e.title } : null,
    preview: e.contentMd?.trim() ? markdownPreview(e.contentMd) : '',
  }));

  return (
    <ProjectLogClient
      projectId={projectId}
      projectTitle={project.title}
      total={logs.total}
      page={logs.page}
      totalPages={logs.totalPages}
      limit={limit}
      backTo={backTo}
      basePath={`/projects/${projectId}/log`}
      items={items}
    />
  );
}
