// src/app/_components/Form/project/actions/save.ts
import { apiDelete, apiPatch, apiPost, apiPostWithResponse } from '@/app/_lib/request';
import { ProjectFormMode, ProjectFormValues } from '@/app/_components/Form/project/types';
import { ProjectDetail, Tag } from '@/types';
import {
  collectTags,
  diffPhotos,
  unifyPhotos,
  processPhotos,
} from '@/app/_components/Form/common/utils';

type Args = {
  mode: ProjectFormMode;
  initialProject: Partial<ProjectDetail>;
  allTags: Tag[];
  values: ProjectFormValues;
};

const toggleArchive = async ({
  mode,
  initialProject,
  values,
}: {
  mode: ProjectFormMode;
  initialProject: Partial<ProjectDetail>;
  values: Args['values'];
}) => {
  if (mode!.kind === 'edit') {
    const initialArchivedAt = initialProject.archivedAt ?? null;
    const wasArchived = !!initialArchivedAt;
    const wantArchived = values!.archived;

    if (wantArchived && !wasArchived)
      await apiPost(`/api/projects/${initialProject.id}/archive`, {});
    if (!wantArchived && wasArchived)
      await apiPost(`/api/projects/${initialProject.id}/unarchive`, {});
  }
};

const addTags = async ({
  nextTags,
  initialProject,
  allTags,
}: {
  nextTags: string[];
  initialProject: Partial<ProjectDetail>;
  allTags: Tag[];
}) => {
  const initialTags = (initialProject.tags as Tag[] | undefined)?.map((t) => t.name) ?? [];
  const mappedTags = new Map<string, Tag>();
  allTags.forEach((tag: Tag) => {
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
  const normalizedTitle = values.title.trim() || 'Untitled project';

  let projectId = mode.kind === 'edit' ? mode.projectId : '';

  const { title, tags, archived, cover, photos, ...restValues } = values;

  const { toDelete, toCreate, toPatch } = diffPhotos(
    unifyPhotos(initialProject.cover, initialProject.photos ?? []),
    unifyPhotos(cover, photos),
  );

  await processPhotos({ toDelete, toCreate, toPatch, projectId });

  if (mode.kind === 'create') {
    const created = await apiPostWithResponse<{ id: string }>(`/api/projects`, {
      title: normalizedTitle,
      ...restValues,
    });
    projectId = created.id;
  } else {
    await apiPatch(`/api/projects/${projectId}`, {
      title: normalizedTitle,
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
