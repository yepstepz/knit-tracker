import { revalidatePath } from 'next/cache';

export function revalidateProjectsList() {
  revalidatePath('/');
}

export function revalidateProjectDetail(projectId?: string | null) {
  if (!projectId) return;
  revalidatePath(`/projects/${projectId}`);
}

export function revalidateLogsList(projectId?: string | null) {
  if (!projectId) return;
  revalidatePath(`/projects/${projectId}/log`);
}

export function revalidateTagsImpact(opts: { projectId?: string | null; tagId?: string | null }) {
  revalidateProjectsList();
  revalidateProjectDetail(opts.projectId ?? null);
  if (opts.tagId) {
    revalidatePath(`/tags/${opts.tagId}`);
  }
}
