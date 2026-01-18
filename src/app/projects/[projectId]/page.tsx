import styles from "./page.module.css";
import { apiGet } from "../../_lib/serverFetch";
import { qs } from "../../_lib/qs";
import { fmtDate } from "../../_lib/format";
import {
  Badge,
  ButtonLink,
  KeyValueGrid,
  LogEntryCard,
  Panel,
  PhotoStack,
  ProjectHeader,
  Section,
  SectionTitle,
  Tabs,
  Muted,
} from "../../_components";

type Tag = { id: string; name: string; color?: string | null };

type Photo = {
  id: string;
  uri: string;
  caption?: string | null;
  alt?: string | null;
  role?: string | null;
};

type LogEntry = {
  id: string;
  happenedAt: string;
  title: string;
  contentMd: string;
  photo?: { uri: string; alt?: string | null; caption?: string | null } | null;
};

type ProjectDetail = {
  id: string;
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  archivedAt: string | null;

  tags: any;
  cover?: Photo | null;
  photos?: Photo[];
  logEntries: LogEntry[];
};

function pickTags(input: any): Tag[] {
  if (!input) return [];
  if (Array.isArray(input) && typeof input[0]?.name === "string") return input as Tag[];
  if (Array.isArray(input) && typeof input[0]?.tag?.name === "string") {
    return (input as any[]).map((x) => x.tag) as Tag[];
  }
  return [];
}

function buildPhotoStack(project: ProjectDetail): Photo[] {
  const cover =
    (project as any).cover ??
    (Array.isArray(project.photos) ? project.photos.find((p) => p.role === "COVER") ?? null : null);

  const all = Array.isArray(project.photos) ? project.photos : [];

  const stack: Photo[] = [];
  if (cover) stack.push(cover);
  for (const p of all) if (!cover || p.id !== cover.id) stack.push(p);
  return stack;
}

export default async function ProjectPage({
                                            params,
                                            searchParams,
                                          }: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;

  const tab = sp.tab === "log" ? "log" : "notes";

  const project = await apiGet<ProjectDetail>(`/api/projects/${projectId}`);

  const tags = pickTags(project.tags).map((t) => ({ id: t.id, name: t.name, color: t.color }));
  const photos = buildPhotoStack(project);

  const tabs = [
    { key: "notes", label: "Notes", href: `/projects/${projectId}${qs({ tab: "notes" })}` },
    { key: "log", label: "Log", href: `/projects/${projectId}${qs({ tab: "log" })}` },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <ButtonLink variant="back" href="/">
          ← Projects
        </ButtonLink>

        <div className={styles.topActions}>
          {project.archivedAt ? <Badge>Archived</Badge> : null}
          <Badge>{project.status}</Badge>
        </div>
      </div>

      <div className={styles.shell}>
        <aside className={styles.left}>
          <PhotoStack photos={photos} titleFallback={project.title} />
        </aside>

        <section className={styles.right}>
          <ProjectHeader
            title={project.title}
            startedAt={project.startedAt}
            updatedAt={project.updatedAt}
            finishedAt={project.finishedAt}
            tags={tags}
          />

          <div className={styles.contentGrid}>
            <section className={styles.main}>
              <Tabs activeKey={tab} tabs={tabs} />

              <Panel>
                {tab === "notes" ? (
                  <>
                    <Section>
                      <SectionTitle>Description</SectionTitle>
                      {project.descriptionMd?.trim() ? (
                        <div className={styles.text}>{project.descriptionMd}</div>
                      ) : (
                        <Muted>No notes yet.</Muted>
                      )}
                    </Section>

                    <Section>
                      <SectionTitle>Yarn plan</SectionTitle>
                      {project.yarnPlan?.trim() ? (
                        <div className={styles.text}>{project.yarnPlan}</div>
                      ) : (
                        <Muted>No yarn plan yet.</Muted>
                      )}
                    </Section>

                    <Section>
                      <SectionTitle>Latest progress</SectionTitle>

                      {project.logEntries?.length ? (
                        <div className={styles.logList}>
                          {project.logEntries.map((e) => (
                            <LogEntryCard key={e.id} entry={e} mode="preview" />
                          ))}
                        </div>
                      ) : (
                        <Muted>No log entries yet.</Muted>
                      )}

                      <div className={styles.sectionActions}>
                        <ButtonLink variant="outline" href={`/projects/${projectId}/log?page=1`}>
                          View all log →
                        </ButtonLink>
                      </div>
                    </Section>
                  </>
                ) : (
                  <Section>
                    <SectionTitle>Log (latest)</SectionTitle>

                    {project.logEntries?.length ? (
                      <div className={styles.logList}>
                        {project.logEntries.map((e) => (
                          <LogEntryCard key={e.id} entry={e} mode="full" />
                        ))}
                      </div>
                    ) : (
                      <Muted>No log entries yet.</Muted>
                    )}

                    <div className={styles.sectionActions}>
                      <ButtonLink variant="outline" href={`/projects/${projectId}/log?page=1`}>
                        Open paginated log →
                      </ButtonLink>
                    </div>
                  </Section>
                )}
              </Panel>
            </section>

            <aside className={styles.side}>
              <div className={styles.sideCard}>
                <div className={styles.sideTitle}>Overview</div>
                <KeyValueGrid
                  rows={[
                    { k: "Status", v: project.status },
                    { k: "Created", v: fmtDate(project.createdAt) },
                    { k: "Updated", v: fmtDate(project.updatedAt) },
                    { k: "Started", v: fmtDate(project.startedAt) },
                    { k: "Finished", v: fmtDate(project.finishedAt) },
                    { k: "Archived", v: fmtDate(project.archivedAt) },
                  ]}
                />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
