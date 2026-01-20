export type PatchProjectInput = Partial<{
  title: string;
  status: string;
  descriptionMd: string;
  yarnPlan: string;
  startedAt: string | null;
  finishedAt: string | null;
}>;

export type UpsertCoverInput = {
  projectId: string;
  coverPhotoId: string | null;
  uri: string;
  caption?: string;
  alt?: string;
};

export type AddGalleryPhotoInput = {
  projectId: string;
  uri: string;
  caption?: string;
  alt?: string;
};

async function readErr(res: Response) {
  const t = await res.text().catch(() => "");
  throw new Error(t || `Request failed (${res.status})`);
}

export async function patchProject(projectId: string, input: PatchProjectInput) {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) await readErr(res);
}

export async function archiveProject(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/archive`, { method: "POST" });
  if (!res.ok) await readErr(res);
}

export async function unarchiveProject(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/unarchive`, { method: "POST" });
  if (!res.ok) await readErr(res);
}

export async function addProjectTag(projectId: string, tagId: string) {
  const res = await fetch(`/api/projects/${projectId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });
  if (!res.ok) await readErr(res);
}

export async function removeProjectTag(projectId: string, tagId: string) {
  const res = await fetch(`/api/projects/${projectId}/tags/${tagId}`, { method: "DELETE" });
  if (!res.ok) await readErr(res);
}

export async function upsertCoverPhoto(input: UpsertCoverInput) {
  const uri = input.uri.trim();
  if (!uri) return;

  const payload = {
    uri,
    caption: input.caption ?? "",
    ...(input.alt?.trim() ? { alt: input.alt.trim() } : {}),
    role: "COVER",
  };

  // replace existing cover
  if (input.coverPhotoId) {
    const res = await fetch(`/api/photos/${input.coverPhotoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) await readErr(res);
    return;
  }

  // create cover
  const res = await fetch(`/api/projects/${input.projectId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await readErr(res);
}

export async function addGalleryPhoto(input: AddGalleryPhotoInput) {
  const uri = input.uri.trim();
  if (!uri) throw new Error("Photo URL is required");

  const res = await fetch(`/api/projects/${input.projectId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uri,
      caption: input.caption ?? "",
      ...(input.alt?.trim() ? { alt: input.alt.trim() } : {}),
      role: "GALLERY",
    }),
  });

  if (!res.ok) await readErr(res);
}

export async function deletePhoto(photoId: string) {
  const res = await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
  if (!res.ok) await readErr(res);
}
