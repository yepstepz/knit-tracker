// src/app/_components/Form/project/actions/save.ts
import { apiDelete, apiPatch, apiPost, apiPostWithResponse } from '@/app/_lib/request';
import { ProjectFormMode } from '@/app/_components/Form/project/types';
import { ProjectDetail, Tag, Photo } from '@/types';
import { collectTags, diffPhotos, unifyPhotos } from '@/app/_components/Form/project/_helpers';
import { processPhotos } from '@/app/_components/Form/project/actions/image';

type Args = {
  mode: ProjectFormMode;
  initialProject: ProjectDetail;
  initialTags: Tag[];
  values: {
    title: string;
    status: string;
    startedAt: string | null;
    finishedAt: string | null;
    archived: boolean;
    tags: Tag['name'][];
    photos: Photo[];
    cover: Photo;
  };
};

const toggleArchive = async ({
  mode,
  initialProject,
  values,
}: {
  mode: ProjectFormMode;
  initialProject: ProjectDetail;
  values: Args['values'];
}) => {
  if (mode!.kind === 'edit') {
    const initialArchivedAt = initialProject!.archivedAt;
    const wasArchived = !!initialArchivedAt;
    const wantArchived = values!.archived;

    if (wantArchived && !wasArchived)
      await apiPost(`/api/projects/${initialProject.id}/archive`, {});
    if (!wantArchived && wasArchived)
      await apiPost(`/api/projects/${initialProject.id}/unarchive`, {});
  }
};

const addTags = async ({ nextTags, initialProject, allTags }) => {
  const initialTags = initialProject.tags.map((t) => t.name);
  const mappedTags = new Map();
  allTags.forEach((tag) => {
    mappedTags.set(tag.name, tag);
  });
  const projectId = initialProject.id;

  const { added, removed } = collectTags(initialTags, nextTags);

  for (let tagName of added) {
    await apiPost(`/api/projects/${projectId}/tags`, { tagId: mappedTags.get(tagName)?.id });
  }

  for (let tagName of removed) {
    await apiDelete(`/api/projects/${projectId}/tags/${mappedTags.get(tagName)?.id}`);
  }
};

export async function save({
  mode,
  initialProject,
  allTags,
  values,
}: Args): Promise<{ projectId: string; goTo: string }> {
  const title = values.title.trim() || 'Untitled project';

  let projectId = mode.kind === 'edit' ? mode.projectId : '';

  const { tags, archived, cover, photos, ...restValues } = values;

  const { toDelete, toCreate, toPatch } = diffPhotos(
    unifyPhotos(initialProject.cover, initialProject.photos),
    unifyPhotos(cover, photos),
  );

  await processPhotos({ toDelete, toCreate, toPatch, projectId });

  console.log({ toDelete, toCreate, toPatch });

  if (mode.kind === 'create') {
    const created = await apiPostWithResponse<{ id: string }>(`/api/projects`, {
      title,
      ...restValues,
    });
    projectId = created.id;
  } else {
    await apiPatch(`/api/projects/${projectId}`, {
      title,
      ...restValues,
    });
  }

  if (mode.kind === 'edit') {
    await toggleArchive({ mode, initialProject, values });
  }

  await addTags({
    nextTags: values.tags,
    initialProject,
    allTags,
  });

  const goTo = `/projects/${projectId}`;

  return { projectId, goTo };
}
