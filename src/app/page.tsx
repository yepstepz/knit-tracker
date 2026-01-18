import styles from "./page.module.css";
import { apiGet } from "./_lib/serverFetch";
import { qs } from "./_lib/qs";
import { ButtonLink, Pagination, ProjectCard, TagCloud } from "./_components";

type Tag = { id: string; name: string; color?: string | null };

type Photo = { id: string; uri: string; caption: string; alt?: string | null };

type RawProjectItem = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  tags: any; // может быть Tag[] или ProjectTag[] (с tag внутри)
  cover: Photo | null;
};

type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function pickTags(input: any): Tag[] {
  if (!input) return [];
  if (Array.isArray(input) && typeof input[0]?.name === "string") return input as Tag[];
  if (Array.isArray(input) && typeof input[0]?.tag?.name === "string") {
    return (input as any[]).map((x) => x.tag) as Tag[];
  }
  return [];
}

export default async function Home({
                                     searchParams,
                                   }: {
  searchParams: Promise<{ page?: string; limit?: string; archived?: string; tagId?: string }>;
}) {
  const sp = await searchParams;

  const page = sp.page ?? "1";
  const limit = sp.limit; // не выдумываем лимиты в UI
  const tagId = sp.tagId;
  const archived = sp.archived === "1" ? "1" : undefined;

  const [projectsRes, tagsRes] = await Promise.all([
    apiGet<Paginated<RawProjectItem>>(`/api/projects${qs({ page, limit, tagId, archived })}`),
    apiGet<Tag[]>(`/api/tags`),
  ]);

  const cards = projectsRes.items.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    updatedAt: p.updatedAt,
    cover: p.cover,
    tags: pickTags(p.tags).map((t) => ({ id: t.id, name: t.name, color: t.color })),
  }));

  const hrefForPage = (p: number) => `/${qs({ page: String(p), limit, tagId, archived })}`;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>Knit Tracker</div>
          <div className={styles.subtitle}>Projects dashboard</div>
        </div>

        <div className={styles.actions}>
          <ButtonLink
            href={`/${qs({
              page: "1",
              limit,
              tagId, // сохраняем тег
              archived: archived === "1" ? undefined : "1",
            })}`}
          >
            {archived === "1" ? "Active" : "Archived"}
          </ButtonLink>

          {tagId ? (
            <ButtonLink href={`/${qs({ page: "1", limit, archived })}`}>Clear tag</ButtonLink>
          ) : null}
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.main}>
          <div className={styles.mainTop}>
            <h1 className={styles.h1}>{archived === "1" ? "Archived projects" : "Active projects"}</h1>
            <div className={styles.meta}>{projectsRes.total} total</div>
          </div>

          {cards.length ? (
            <div className={styles.grid}>
              {cards.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>No projects found.</div>
          )}

          <Pagination page={projectsRes.page} totalPages={projectsRes.totalPages} hrefForPage={hrefForPage} />
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Tags</div>
          <TagCloud tags={tagsRes} activeTagId={tagId} archived={archived} limit={limit} />
          <div className={styles.sidebarHint}>Click a tag to filter projects.</div>
        </aside>
      </div>
    </main>
  );
}
