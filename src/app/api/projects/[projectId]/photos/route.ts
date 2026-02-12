import { getProjectPhotos } from '../_lib/getProjectPhotos';
import { addProjectPhoto } from '../_lib/addProjectPhoto';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';
import { unauthorized } from '@/server/helpers/http';

export async function GET(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  return getProjectPhotos(projectId);
}

export async function POST(req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  if (!requireAuth()) return unauthorized();
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await addProjectPhoto(projectId, body);
  revalidateAfterProjectChange(projectId);
  return res;
}
