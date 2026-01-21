import { apiGet } from "./_lib/serverFetch";
import { qs } from "./_lib/qs";
import { Paginated, ProjectListItem, Tag } from "@/types";
import { HomeClient } from './home-client';

function fmtDateStable(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  // фиксируем locale чтобы не зависеть от окружения, или вообще делаем ISO-дату
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit" }).format(d);
}

export default async function Home({ searchParams}: {
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

  const cards = projectsRes.items.map((p) => ({
    ...p,
    updatedAt: fmtDateStable(p.updatedAt),
  }));

  return (
    <HomeClient
      projects={cards}
      tags={tagsRes}
      page={projectsRes.page}
      totalPages={projectsRes.totalPages}
      total={projectsRes.total}
      query={{ page, limit, tagId, archived }}
    />
  );
}
