import { notFound } from "next/navigation";
import styles from "./page.module.css";

import { apiGet } from "../../_lib/serverFetch";
import { qs } from "../../_lib/qs";
import { ButtonLink, Pagination, ProjectCard, TagChip } from "../../_components";
import { Tag, Paginated, ProjectDetail } from "@/types";

export default async function TagPage({
                                        params,
                                        searchParams,
                                      }: {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<{ page?: string; limit?: string; archived?: string }>;
}) {
  const { tagId } = await params;
  const sp = await searchParams;

  const page = sp.page ?? "1";
  const limit = sp.limit ?? "10";

  // archived можно поддержать, если хочешь (тут оставил поддержку как опцию),
  // но если не надо — просто убери из qs ниже.
  const archived = sp.archived === "1" ? "1" : undefined;

  const [tags, projectsRes] = await Promise.all([
    apiGet<Tag[]>(`/api/tags`),
    apiGet<Paginated<ProjectDetail>>(
      `/api/projects${qs({ page, limit, tagId, archived })}`
    ),
  ]);

  const tag = tags.find((t) => t.id === tagId);
  if (!tag) return notFound();

  const hrefForPage = (p: number) =>
    `/tags/${tagId}${qs({ page: String(p), limit, archived })}`;

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <ButtonLink variant="back" href="/">
          ← Projects
        </ButtonLink>
      </header>

      <section className={styles.shell}>
        <div className={styles.head}>
          <div className={styles.kicker}>Tag</div>

          <div className={styles.titleRow}>
            <h1 className={styles.h1}>{tag.name}</h1>
            <div className={styles.tagChip}>
              {/* на странице тега делаем статичным */}
              <TagChip tag={tag} static />
            </div>
          </div>

          <div className={styles.meta}>
            {projectsRes.total} projects · page {projectsRes.page} / {projectsRes.totalPages}
          </div>
        </div>

        {projectsRes.items.length ? (
          <div className={styles.grid}>
            {projectsRes.items.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No projects for this tag.</div>
        )}

        <div className={styles.paginationWrap}>
          <Pagination page={projectsRes.page} totalPages={projectsRes.totalPages} hrefForPage={hrefForPage} />
        </div>
      </section>
    </main>
  );
}
