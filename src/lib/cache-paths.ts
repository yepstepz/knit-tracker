import { revalidatePath } from 'next/cache';

export function revalidateProjectsList() {
  revalidatePath('/');
}

export function revalidateTagsList() {
  revalidatePath('/tags');
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
  revalidateTagsList();
  revalidateProjectDetail(opts.projectId ?? null);
  if (opts.tagId) {
    revalidatePath(`/tags/${opts.tagId}`);
  }
}

export function revalidateAfterLogChange(projectId?: string | null, tagId?: string | null) {
  revalidateLogsList(projectId ?? null);
  revalidateProjectDetail(projectId ?? null);
  if (tagId) revalidatePath(`/tags/${tagId}`);
}

export function revalidateAfterProjectChange(projectId?: string | null, tagId?: string | null) {
  revalidateProjectsList();
  revalidateProjectDetail(projectId ?? null);
  if (tagId) revalidatePath(`/tags/${tagId}`);
}
