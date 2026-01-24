import { LogEntry, ProjectDetail } from '@/types';
import { apiPatch, apiPostWithResponse } from '@/app/_lib/request';
import { diffPhotos, processPhotos } from '@/app/_components/Form/common/utils';

type Args = {
  project: ProjectDetail;
  mode: {
    kind: 'edit' | 'create';
  };
  initialForm: Partial<LogEntry>;
  values: Omit<LogEntry, 'id'>;
};

export async function save({
  project,
  mode,
  initialForm,
  values,
}: Args): Promise<{ logEntryId: string; goTo: string }> {
  let logEntryId = initialForm.id || '';
  const projectId = project.id;
  console.log({ values });

  const { photo, ...restValues } = values;

  if (mode.kind === 'create') {
    const { id } = await apiPostWithResponse(`/api/projects/${projectId}/log`, {
      ...restValues,
    });
    logEntryId = id;
  } else {
    await apiPatch(`/api/projects/${projectId}/log/${logEntryId}`, {
      ...restValues,
    });
  }

  const { toDelete, toCreate, toPatch } = diffPhotos([initialForm.photo], [photo]);

  console.log({ toDelete, toCreate, toPatch });

  await processPhotos({ toDelete, toCreate, toPatch, projectId, logEntryId });

  // POST projects/{{projectIdForPatch}}/log
  // POST /api/projects/{{projectIdForPatch}}/log/{{logEntryId2}}/photos
  // PATCH projects/{{projectId}}/log/{{logEntryId2}}

  // PATCH {{baseUrl}}/api/photos/{{photoId}}
  return;
}
