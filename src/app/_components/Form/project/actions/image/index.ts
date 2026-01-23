import { apiDelete, apiPatch, apiPost } from '@/app/_lib/request';
import { Photo } from '@/types';

type PatchPhoto = { id: string; patch: Partial<Photo> };

export async function deletePhotos(projectId: string, photoIds: string[]) {
  for (const id of photoIds) {
    await apiDelete(`/api/photos/${id}`);
  }
}

export async function createPhotos(projectId: string, photos: Photo[]) {
  for (const p of photos) {
    await apiPost(`/api/projects/${projectId}/photos`, {
      uri: p.uri,
      caption: p.caption,
      alt: p.alt ?? null,
      role: p.role,
    });
  }
}

export async function patchPhotos(projectId: string, photos: PatchPhoto[]) {
  for (const p of photos) {
    await apiPatch(`/api/photos/${p.id}`, p.patch);
  }
}

export async function processPhotos({ toCreate, toPatch, toDelete, projectId }) {
  return Promise.all([
    deletePhotos(projectId, toDelete),
    createPhotos(projectId, toCreate),
    patchPhotos(projectId, toPatch),
  ]);
}
