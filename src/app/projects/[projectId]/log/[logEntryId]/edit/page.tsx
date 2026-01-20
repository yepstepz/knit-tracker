import { redirect, notFound } from "next/navigation";
import { apiGet } from "@/app/_lib/serverFetch";
import { ButtonLink, Badge } from "@/app/_components";
import { LogEntryForm } from "../../_components/LogEntryForm";
import styles from "./page.module.css";
import { LogEntry, ProjectDetail } from "@/types";

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
    <main className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <ButtonLink variant="back" href={`/projects/${projectId}/log/${logEntryId}`}>
          ← Back
        </ButtonLink>

        <div className={styles.badges}>
          {project.archivedAt ? <Badge>Archived</Badge> : null}
          <Badge>{project.status}</Badge>
        </div>
      </div>

      <div className={styles.head}>
        <div className="kicker">Edit log · {project.title}</div>
        <h1 className="h1">{entry.title}</h1>
      </div>

      <LogEntryForm
        projectId={projectId}
        mode={{ kind: "edit", logEntryId }}
        initial={{
          title: entry.title,
          contentMd: entry.contentMd ?? "",
          happenedAt: entry.happenedAt,
          photo: entry.photo
        }}
        redirectTo={`/projects/${projectId}/log/${logEntryId}`}
      />

      {/* простой UX: кнопка cancel под формой */}
      <div className={styles.footer}>
        <ButtonLink variant="ghost" href={`/projects/${projectId}/log/${logEntryId}`}>
          Cancel
        </ButtonLink>
      </div>
    </main>
  );
}
