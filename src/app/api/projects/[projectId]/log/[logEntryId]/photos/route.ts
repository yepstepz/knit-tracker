import { getLogEntryPhotos } from '../_lib/getLogEntryPhotos';
import { addLogEntryPhoto } from '../_lib/addLogEntryPhoto';
import { revalidateLogsList, revalidateProjectDetail } from '@/lib/cache-paths';

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
  const { projectId, logEntryId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await addLogEntryPhoto(projectId, logEntryId, body);
  revalidateLogsList(projectId);
  revalidateProjectDetail(projectId);
  return res;
}
