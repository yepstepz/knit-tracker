import { getProject } from "./_lib/getProject";
import { editProject } from "./_lib/editProject";

export async function GET(_req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  return getProject(projectId);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  return editProject(projectId, body);
}
