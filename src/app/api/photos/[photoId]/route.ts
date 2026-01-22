import { editPhoto } from './_lib/editPhoto';
import { deletePhoto } from './_lib/deletePhoto';

export async function PATCH(req: Request, ctx: { params: Promise<{ photoId: string }> }) {
  const { photoId } = await ctx.params;
  const body = await req.json().catch(() => null);
  return editPhoto(photoId, body);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ photoId: string }> }) {
  const { photoId } = await ctx.params;
  return deletePhoto(photoId);
}
