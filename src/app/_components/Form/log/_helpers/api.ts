import { apiDelete, apiPatch, apiPost, apiPostWithResponse } from '@/app/_lib/request';
import { localInputToIso } from '@/app/projects/[projectId]/edit/_helpers/api';

type PhotoPlan = {
  create: Array<{ uri: string; caption: string; alt: string | null; sortOrder?: number | null }>;
  patch: Array<{ id: string; patch: any }>;
  delete: string[];
};

async function applyPhotoPlanToLog(args: {
  projectId: string;
  logEntryId: string;
  plan: PhotoPlan;
}) {
  // delete
  for (const id of args.plan.delete) await apiDelete(`/api/photos/${id}`);
  // patch
  for (const p of args.plan.patch) await apiPatch(`/api/photos/${p.id}`, p.patch);
  // create (single photo => максимум 1, но тут без разницы)
  for (const p of args.plan.create) {
    await apiPost(`/api/projects/${args.projectId}/log/${args.logEntryId}/photos`, {
      uri: p.uri,
      caption: p.caption,
      alt: p.alt ?? undefined,
      role: 'GALLERY',
      sortOrder: p.sortOrder ?? 0,
    });
  }
}

export async function saveLogEntry(args: {
  mode:
    | { kind: 'create'; backTo: string }
    | { kind: 'edit'; logEntryId: string; redirectTo: string };
  projectId: string;

  title: string;
  contentMd: string;
  happenedAtLocal: string;

  photoPlan: PhotoPlan;
}): Promise<{ logEntryId: string }> {
  const { mode, projectId } = args;

  let logEntryId = mode.kind === 'edit' ? mode.logEntryId : '';

  if (mode.kind === 'create') {
    const created = await apiPostWithResponse<{ id: string }>(`/api/projects/${projectId}/log`, {
      title: args.title.trim() || 'Untitled log',
      contentMd: args.contentMd,
      happenedAt: localInputToIso(args.happenedAtLocal),
    });
    logEntryId = created.id;
  } else {
    await apiPatch(`/api/projects/${projectId}/log/${logEntryId}`, {
      title: args.title,
      contentMd: args.contentMd,
      happenedAt: localInputToIso(args.happenedAtLocal),
    });
  }

  await applyPhotoPlanToLog({ projectId, logEntryId, plan: args.photoPlan });

  return { logEntryId };
}
