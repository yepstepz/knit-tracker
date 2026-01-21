import { notFound } from "next/navigation";
import { apiGet } from "@/app/_lib/serverFetch";
import { fmtDate } from "@/app/_lib/format";
import type { LogEntry, ProjectDetail } from "@/types";
import LogEntryClient from "./log-entry-client";

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
      apiGet<ProjectDetail>(`/api/projects/${projectId}`),
      apiGet<LogEntry>(`/api/projects/${projectId}/log/${logEntryId}`),
    ]);
  } catch {
    notFound();
  }

  const happenedAtLabel = fmtDate(entry.happenedAt);

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
