import {apiGet} from "@/app/_lib/request";
import type {ProjectDetail} from "@/types";
import {ProjectPageClient} from "./project-page-client";
import {fmtDate} from "../../_lib/format";

export default async function ProjectPage({
                                            params,
                                          }: {
  params: Promise<{ projectId: string }>;
}) {
  const {projectId} = await params;

  const projectApi = await apiGet<ProjectDetail>(`/api/projects/${projectId}`);

  const logs = projectApi.logEntries.map((log) => ({
    ...log,
    contentMd: log.contentMd.trim(),
    happenedAt: fmtDate(log.happenedAt)
  }))

  console.log(projectApi);

  const project = {
    ...projectApi,
    createdAt: fmtDate(projectApi.createdAt),
    updatedAt: fmtDate(projectApi.updatedAt),
    startedAt: fmtDate(projectApi.startedAt),
    finishedAt: fmtDate(projectApi.finishedAt),
    archivedAt: fmtDate(projectApi.archivedAt),
    logEntries: logs
  }

  return <ProjectPageClient projectId={projectId} project={project}/>;
}
