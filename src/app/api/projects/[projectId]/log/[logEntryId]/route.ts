import { getLogEntry } from './_lib/getLogEntry';
import { editLogEntry } from './_lib/editLogEntry';
import { deleteLogEntry } from './_lib/deleteLogEntry';
import { revalidateAfterLogChange } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';
import { unauthorized } from '@/server/helpers/http';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  const { projectId, logEntryId } = await ctx.params;
  return getLogEntry(projectId, logEntryId);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  if (!requireAuth()) return unauthorized();
  const { projectId, logEntryId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await editLogEntry(projectId, logEntryId, body);
  revalidateAfterLogChange(projectId);
  return res;
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  if (!requireAuth()) return unauthorized();
  const { projectId, logEntryId } = await ctx.params;
  const res = await deleteLogEntry(projectId, logEntryId);
  revalidateAfterLogChange(projectId);
  return res;
}
