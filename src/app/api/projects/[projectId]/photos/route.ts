import { getProjectPhotos } from '../_lib/getProjectPhotos';
import { addProjectPhoto } from '../_lib/addProjectPhoto';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export async function GET(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  return getProjectPhotos(projectId);
}

export const POST = withAuth(async (req: Request, ctx: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await addProjectPhoto(projectId, body);
  revalidateAfterProjectChange(projectId);
  return res;
});
