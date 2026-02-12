import { getLogEntryPhotos } from '../_lib/getLogEntryPhotos';
import { addLogEntryPhoto } from '../_lib/addLogEntryPhoto';
import { revalidateAfterLogChange } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';
import { unauthorized } from '@/server/helpers/http';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  const { projectId, logEntryId } = await ctx.params;
  return getLogEntryPhotos(projectId, logEntryId);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  if (!requireAuth()) return unauthorized();
  const { projectId, logEntryId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await addLogEntryPhoto(projectId, logEntryId, body);
  revalidateAfterLogChange(projectId);
  return res;
}
