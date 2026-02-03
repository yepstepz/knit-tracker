import { getProjectPhotos } from '../_lib/getProjectPhotos';
import { addProjectPhoto } from '../_lib/addProjectPhoto';
import { revalidateProjectsList, revalidateProjectDetail } from '@/lib/cache-paths';

export async function GET(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  return getProjectPhotos(projectId);
}

export async function POST(req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await addProjectPhoto(projectId, body);
  revalidateProjectsList();
  revalidateProjectDetail(projectId);
  return res;
}
