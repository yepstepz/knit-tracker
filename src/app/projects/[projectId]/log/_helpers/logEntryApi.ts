export type LogEntryInput = {
  title: string;
  contentMd?: string;
  happenedAt?: string; // ISO
};

export type PhotoInput = {
  uri: string;
  caption?: string;
  alt?: string;
  role?: "GALLERY" | "COVER";
};

async function err(res: Response) {
  const t = await res.text().catch(() => "");
  throw new Error(t || `Request failed (${res.status})`);
}

export async function createLogEntry(projectId: string, input: LogEntryInput) {
  const res = await fetch(`/api/projects/${projectId}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) await err(res);
  return (await res.json()) as { id: string };
}

export async function updateLogEntry(projectId: string, logEntryId: string, input: LogEntryInput) {
  const res = await fetch(`/api/projects/${projectId}/log/${logEntryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) await err(res);
}

export async function upsertLogEntryPhoto(
  projectId: string,
  logEntryId: string,
  input: PhotoInput
) {
  const res = await fetch(`/api/projects/${projectId}/log/${logEntryId}/photos`, {
    method: "POST", // upsert
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "GALLERY", ...input }),
  });
  if (!res.ok) await err(res);
}
