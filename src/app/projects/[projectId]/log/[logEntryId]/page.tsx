import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { apiGet } from "@/app/_lib/serverFetch";
import { fmtDate } from "@/app/_lib/format";
import { ButtonLink } from "@/app/_components";
import { LogEntry, ProjectDetail } from "@/types";
import { DeleteLogEntryButton } from "@/app/projects/[projectId]/log/_components/DeleteLogEntryButton";

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

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.leftActions}>
          <ButtonLink variant="back" href={`/projects/${projectId}`}>
            ← Project
          </ButtonLink>
          <ButtonLink variant="ghost" href={`/projects/${projectId}/log?page=1`}>
            ← All logs
          </ButtonLink>
        </div>
      </header>

      <section className={styles.shell}>
        <div className={styles.kicker}>Log entry · {project.title}</div>

        <div className={styles.headerRow}>
          <h1 className={styles.title}>{entry.title}</h1>
          <div className={styles.date}>{fmtDate(entry.happenedAt)}</div>
        </div>

        {entry.photo?.uri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.photo}
            src={entry.photo.uri}
            alt={entry.photo.alt ?? entry.photo.caption ?? entry.title}
          />
        ) : null}

        {entry.contentMd?.trim() ? (
          <div className={styles.text}>{entry.contentMd}</div>
        ) : (
          <div className={styles.muted}>No text</div>
        )}
      </section>
      <div className={styles.actions}>
        <ButtonLink variant="outline" href={`/projects/${projectId}/log/${logEntryId}/edit`}>
          Edit log
        </ButtonLink>

        <DeleteLogEntryButton
          projectId={projectId}
          logEntryId={logEntryId}
          redirectTo={`/projects/${projectId}/log?page=1&limit=10`}
        />
      </div>
    </main>
  );
}
