import styles from "./page.module.css";
import { apiGet } from "./_lib/serverFetch";
import { qs } from "./_lib/qs";
import { ButtonLink, Pagination, ProjectCard, TagCloud } from "./_components";
import { Paginated, ProjectListItem, Tag } from "@/types";

export default async function Home({
                                     searchParams,
                                   }: {
  searchParams: Promise<{ page?: string; limit?: string; archived?: string; tagId?: string }>;
}) {
  const sp = await searchParams;

  const page = sp.page ?? "1";
  const limit = sp.limit;
  const tagId = sp.tagId;
  const archived = sp.archived === "1" ? "1" : undefined;

  const [projectsRes, tagsRes] = await Promise.all([
    apiGet<Paginated<ProjectListItem>>(`/api/projects${qs({ page, limit, tagId, archived })}`),
    apiGet<Tag[]>(`/api/tags`),
  ]);

  const hrefForPage = (p: number) => `/${qs({ page: String(p), limit, tagId, archived })}`;

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>Knit Tracker</div>
          <div className="muted small">Projects dashboard</div>
        </div>

        <div className={styles.actions}>
          <ButtonLink
            href={`/${qs({
              page: "1",
              limit,
              tagId,
              archived: archived === "1" ? undefined : "1",
            })}`}
          >
            {archived === "1" ? "Active" : "Archived"}
          </ButtonLink>

          {tagId ? <ButtonLink href={`/${qs({ page: "1", limit, archived })}`}>Clear tag</ButtonLink> : null}
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.left}>
          <div className={styles.leftTop}>
            <h1 className="h1">{archived === "1" ? "Archived projects" : "Active projects"}</h1>
            <div className="muted small">{projectsRes.total} total</div>
          </div>

          {projectsRes.items.length ? (
            <div className={styles.grid}>
              {projectsRes.items.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="muted">No projects found.</div>
          )}

          <div className={styles.pager}>
            <Pagination page={projectsRes.page} totalPages={projectsRes.totalPages} hrefForPage={hrefForPage} />
          </div>
        </section>

        <aside className={styles.right}>
          <div className="h3">Tags</div>
          <TagCloud tags={tagsRes} activeTagId={tagId} archived={archived} limit={limit} />
          <div className="muted small">Click a tag to filter projects.</div>
        </aside>
      </div>
    </main>
  );
}
