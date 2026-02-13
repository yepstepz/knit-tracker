import { getLogEntry } from './_lib/getLogEntry';
import { editLogEntry } from './_lib/editLogEntry';
import { deleteLogEntry } from './_lib/deleteLogEntry';
import { revalidateAfterLogChange } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  const { projectId, logEntryId } = await ctx.params;
  return getLogEntry(projectId, logEntryId);
}

export const PATCH = withAuth(async (
  req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) => {
  const { projectId, logEntryId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await editLogEntry(projectId, logEntryId, body);
  revalidateAfterLogChange(projectId);
  return res;
});

export const DELETE = withAuth(async (
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) => {
  const { projectId, logEntryId } = await ctx.params;
  const res = await deleteLogEntry(projectId, logEntryId);
  revalidateAfterLogChange(projectId);
  return res;
});
