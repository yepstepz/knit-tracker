import { getProject } from './_lib/getProject';
import { editProject } from './_lib/editProject';
import { revalidateAfterProjectChange } from '@/lib/cache-paths';
import { requireAuth } from '@/server/helpers/auth';
import { unauthorized } from '@/server/helpers/http';

export async function GET(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  return getProject(projectId);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  if (!requireAuth()) return unauthorized();
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  const res = await editProject(projectId, body);
  revalidateAfterProjectChange(projectId);
  return res;
}
