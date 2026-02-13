import { getLogEntryPhotos } from '../_lib/getLogEntryPhotos';
import { addLogEntryPhoto } from '../_lib/addLogEntryPhoto';
import { revalidateAfterLogChange } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) {
  const { projectId, logEntryId } = await ctx.params;
  return getLogEntryPhotos(projectId, logEntryId);
}

export const POST = withAuth(async (
  req: Request,
  ctx: { params: Promise<{ projectId: string; logEntryId: string }> },
) => {
  const { projectId, logEntryId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await addLogEntryPhoto(projectId, logEntryId, body);
  revalidateAfterLogChange(projectId);
  return res;
});
