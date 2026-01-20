import { getLogEntry } from "./_lib/getLogEntry";
import { editLogEntry } from "./_lib/editLogEntry";
import { deleteLogEntry } from "./_lib/deleteLogEntry";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> }
) {
  const { projectId, logEntryId } = await ctx.params;
  return getLogEntry(projectId, logEntryId);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> }
) {
  const { projectId, logEntryId } = await ctx.params;
  console.log(projectId, logEntryId);
  const body = await req.json().catch(() => null);
  return editLogEntry(projectId, logEntryId, body);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> }
) {
  const { projectId, logEntryId } = await ctx.params;
  return deleteLogEntry(projectId, logEntryId);
}
