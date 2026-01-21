import { apiGet } from "@/app/_lib/serverFetch";
import type { ProjectDetail } from "@/types";
import { LogEntryFormClient } from "@/app/_components/Form/log/LogEntryFormClient";

export default async function CreateLogPage({
                                              params,
                                              searchParams,
                                            }: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ backTo?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;

  const project = await apiGet<ProjectDetail>(`/api/projects/${projectId}`);

  return (
    <LogEntryFormClient
      mode={{ kind: "create", backTo: sp.backTo ?? `/projects/${projectId}/log?page=1&limit=10` }}
      projectId={projectId}
      projectTitle={project.title}
      projectStatus={project.status}
      projectArchivedAt={project.archivedAt}
      initial={{ title: "", contentMd: "", happenedAt: new Date().toISOString(), photo: null }}
    />
  );
}
