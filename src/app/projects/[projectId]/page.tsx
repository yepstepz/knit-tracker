import Link from "next/link";
import cn from 'classnames';
import styles from "./page.module.css";
import { apiGet } from "../../_lib/serverFetch";
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
  Muted,
} from "../../_components";
import { Photo, ProjectDetail } from "@/types";

function buildPhotoStack(project: ProjectDetail): Photo[] {
  return [...(project.cover ? [project.cover] : []), ...project.photos]
}

export default async function ProjectPage({
                                            params,
                                          }: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const project = await apiGet<ProjectDetail>(`/api/projects/${projectId}`);

  const tags = project.tags;
  const photos = buildPhotoStack(project);

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.topBar}>
        <ButtonLink variant="back" href="/">
          ← Projects
        </ButtonLink>

        <div className={styles.topActions}>
          <ButtonLink variant="outline" href={`/projects/${projectId}/edit`}>
            Edit
          </ButtonLink>

          {project.archivedAt ? <Badge>Archived</Badge> : null}
          <Badge>{project.status}</Badge>
        </div>
      </div>

      <div className={styles.shell}>
        <aside className={cn(styles.left, styles.desktopBlocks)}>
          <PhotoStack photos={photos} titleFallback={project.title}/>
        </aside>

        <section className={styles.right}>
          <ProjectHeader
            title={project.title}
            startedAt={project.startedAt}
            updatedAt={project.updatedAt}
            finishedAt={project.finishedAt}
            tags={tags}
          />

          <div className={styles.mobileBlocks}>
            <PhotoStack photos={photos} titleFallback={project.title}/>
          </div>

          <div className={styles.contentGrid}>
            <section className={styles.main}>
              <Panel>
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
              </Panel>

              <div className={styles.mobileBlocks}>
                <Panel>
                  <div className={styles.sideTitle}>Overview</div>
                  <KeyValueGrid
                    rows={[
                      {k: "Status", v: project.status},
                      {k: "Created", v: fmtDate(project.createdAt)},
                      {k: "Updated", v: fmtDate(project.updatedAt)},
                      {k: "Started", v: fmtDate(project.startedAt)},
                      {k: "Finished", v: fmtDate(project.finishedAt)},
                      {k: "Archived", v: fmtDate(project.archivedAt)},
                    ]}
                  />
                </Panel>
              </div>

              <Panel>
                <Section>
                  <SectionTitle>Latest progress</SectionTitle>
                  <div className={styles.toolbar} id='logs'>
                    <ButtonLink
                      variant="outline"
                      href={`/projects/${projectId}/log/create?backTo=${encodeURIComponent(`/projects/${projectId}#logs`)}`}
                    >
                      Add log
                    </ButtonLink>
                  </div>
                  {project.logEntries?.length ? (
                    <div className={styles.logList}>
                      {project.logEntries.map((e) => (
                        <Link
                          key={e.id}
                          href={`/projects/${projectId}/log/${e.id}`}
                          className={styles.logLink}
                        >
                          <LogEntryCard entry={e} mode="preview"/>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Muted>No log entries yet.</Muted>
                  )}

                  <div className={styles.sectionActions}>
                    <ButtonLink variant="outline" href={`/projects/${projectId}/log?page=1&limit=10`}>
                      View all log →
                    </ButtonLink>
                  </div>
                </Section>
              </Panel>
            </section>

            <aside className={cn(styles.side, styles.desktopBlocks)}>
              <Panel>
                <div className={styles.sideTitle}>Overview</div>
                <KeyValueGrid
                  rows={[
                    {k: "Status", v: project.status},
                    {k: "Created", v: fmtDate(project.createdAt)},
                    {k: "Updated", v: fmtDate(project.updatedAt)},
                    {k: "Started", v: fmtDate(project.startedAt)},
                    {k: "Finished", v: fmtDate(project.finishedAt)},
                    {k: "Archived", v: fmtDate(project.archivedAt)},
                  ]}
                />
              </Panel>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
