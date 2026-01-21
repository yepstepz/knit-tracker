import { apiGet } from "@/app/_lib/serverFetch";
import EditProjectClient from "./edit-project-client";
import type { Photo } from "@/app/_components/Form/photos/types";

type Tag = { id: string; name: string; color?: string | null };

type ProjectDetail = {
  id: string;
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  startedAt: string | null;
  finishedAt: string | null;
  archivedAt: string | null;
  tags: Tag[];
};

export default async function EditProjectPage({
                                                params,
                                              }: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const [project, allTags, photos] = await Promise.all([
    apiGet<ProjectDetail>(`/api/projects/${projectId}`),
    apiGet<Tag[]>(`/api/tags`),
    apiGet<Photo[]>(`/api/projects/${projectId}/photos`),
  ]);

  return <EditProjectClient projectId={projectId} project={project} allTags={allTags} photos={photos} />;
}
