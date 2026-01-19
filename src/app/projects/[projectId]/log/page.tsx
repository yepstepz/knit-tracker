import Link from "next/link";
import styles from "./page.module.css";
import { apiGet } from "@/app/_lib/serverFetch";
import { qs } from "@/app/_lib/qs";
import { fmtDate, markdownPreview } from "@/app/_lib/format";
import { ButtonLink, Pagination, Badge } from "@/app/_components";
import { LogEntry, Paginated, ProjectDetail } from "@/types";

export default async function ProjectLogPage({
                                               params,
                                               searchParams,
                                             }: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;

  const page = sp.page ?? "1";
  const limit = sp.limit ?? "10";

  const [project, logs] = await Promise.all([
    apiGet<ProjectDetail>(`/api/projects/${projectId}`),
    apiGet<Paginated<LogEntry>>(`/api/projects/${projectId}/log${qs({ page, limit })}`),
  ]);

  const hrefForPage = (p: number) =>
    `/projects/${projectId}/log${qs({ page: String(p), limit })}`;

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <ButtonLink variant="back" href={`/projects/${projectId}`}>
          ← Back
        </ButtonLink>

        <div className={styles.topRight}>
          {project.archivedAt ? <Badge>Archived</Badge> : null}
          <Badge>{project.status}</Badge>
        </div>
      </header>

      <section className={styles.shell}>
        <div className={styles.head}>
          <div className={styles.kicker}>Project</div>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.meta}>
            {logs.total} logs · page {logs.page} / {logs.totalPages}
          </div>
        </div>

        {logs.items.length ? (
          <div className={styles.feed}>
            {logs.items.map((e) => (
              <Link
                key={e.id}
                href={`/projects/${projectId}/log/${e.id}`}
                className={styles.item}
              >
                <div className={styles.itemTop}>
                  <div className={styles.itemTitle}>{e.title}</div>
                  <div className={styles.itemDate}>{fmtDate(e.happenedAt)}</div>
                </div>

                {e.photo?.uri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.photo}
                    src={e.photo.uri}
                    alt={e.photo.alt ?? e.photo.caption ?? e.title}
                  />
                ) : null}

                {e.contentMd?.trim() ? (
                  <div className={styles.text}>{markdownPreview(e.contentMd)}</div>
                ) : (
                  <div className={styles.muted}>No text</div>
                )}

                <div className={styles.openRow}>
                  <span className={styles.openHint}>Open →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No log entries yet.</div>
        )}

        <div className={styles.paginationWrap}>
          <Pagination page={logs.page} totalPages={logs.totalPages} hrefForPage={hrefForPage} />
        </div>
      </section>
    </main>
  );
}
