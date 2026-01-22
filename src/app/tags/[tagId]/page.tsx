import { notFound } from "next/navigation";
import { apiGet } from "@/app/_lib/request";
import { qs } from "@/app/_lib/qs";
import type { Tag, Paginated, ProjectDetail } from "@/types";
import TagPageClient from "./tag-page-client";

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
  const archived = sp.archived === "1" ? "1" : undefined;

  const [tags, projectsRes] = await Promise.all([
    apiGet<Tag[]>(`/api/tags`),
    apiGet<Paginated<ProjectDetail>>(`/api/projects${qs({ page, limit, tagId, archived })}`),
  ]);

  const tag = tags.find((t) => t.id === tagId);
  if (!tag) return notFound();

  const hrefForPage = (p: number) => `/tags/${tagId}${qs({ page: String(p), limit, archived })}`;

  return (
    <TagPageClient
      tagId={tagId}
      tag={tag}
      archived={archived === "1"}
      total={projectsRes.total}
      page={projectsRes.page}
      totalPages={projectsRes.totalPages}
      hrefForPage={hrefForPage}
      projects={projectsRes.items}
    />
  );
}
