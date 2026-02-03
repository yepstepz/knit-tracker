import { getLogEntry } from './_lib/getLogEntry';
import { editLogEntry } from './_lib/editLogEntry';
import { deleteLogEntry } from './_lib/deleteLogEntry';
import { revalidateLogsList, revalidateProjectDetail } from '@/lib/cache-paths';

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
  const { projectId, logEntryId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await editLogEntry(projectId, logEntryId, body);
  revalidateLogsList(projectId);
  revalidateProjectDetail(projectId);
  return res;
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  const { projectId, logEntryId } = await ctx.params;
  const res = await deleteLogEntry(projectId, logEntryId);
  revalidateLogsList(projectId);
  revalidateProjectDetail(projectId);
  return res;
}
