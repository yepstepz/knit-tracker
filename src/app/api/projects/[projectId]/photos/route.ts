import { getProjectPhotos } from "../_lib/getProjectPhotos";
import { addProjectPhoto } from "../_lib/addProjectPhoto";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  return getProjectPhotos(projectId);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await ctx.params;
  const body = await req.json().catch(() => null);
  return addProjectPhoto(projectId, body);
}
