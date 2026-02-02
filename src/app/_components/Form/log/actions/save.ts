import { LogEntry, ProjectDetail } from '@/types';
import { apiPatch, apiPostWithResponse } from '@/app/_lib/request';
import { diffPhotos, processPhotos } from '@/app/_components/Form/common/utils';

type Args = {
  project: ProjectDetail;
  mode: {
    kind: 'edit' | 'create';
  };
  initialForm: Partial<LogEntry>;
  values: Omit<LogEntry, 'id' | 'happenedAt'> & { happenedAt?: string };
};

export async function save({
  project,
  mode,
  initialForm,
  values,
}: Args): Promise<{ logEntryId: string; goTo: string }> {
  let logEntryId = initialForm.id || '';
  const projectId = project.id;

  const { photo, ...restValues } = values;

  if (mode.kind === 'create') {
    const { id } = await apiPostWithResponse<{ id: string }>(`/api/projects/${projectId}/log`, {
      ...restValues,
    });
    logEntryId = id;
  } else {
    await apiPatch(`/api/projects/${projectId}/log/${logEntryId}`, {
      ...restValues,
    });
  }

  const { toDelete, toCreate, toPatch } = diffPhotos([initialForm.photo], [photo]);

  await processPhotos({ toDelete, toCreate, toPatch, projectId, logEntryId });

  // POST projects/{{projectIdForPatch}}/log
  // POST /api/projects/{{projectIdForPatch}}/log/{{logEntryId2}}/photos
  // PATCH projects/{{projectId}}/log/{{logEntryId2}}

  const goTo = `/projects/${projectId}/log/${logEntryId}`;
  return { logEntryId, goTo };
}
