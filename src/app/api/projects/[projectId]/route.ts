import { getProject } from './_lib/getProject';
import { editProject } from './_lib/editProject';
import { revalidateProjectsList, revalidateProjectDetail } from '@/lib/cache-paths';

export async function GET(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  return getProject(projectId);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await editProject(projectId, body);
  revalidateProjectsList();
  revalidateProjectDetail(projectId);
  return res;
}
