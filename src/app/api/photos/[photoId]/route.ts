import { editPhoto } from './_lib/editPhoto';
import { deletePhoto } from './_lib/deletePhoto';
import { requireAuth } from '@/server/helpers/auth';
import { unauthorized } from '@/server/helpers/http';

export async function PATCH(req: Request, ctx: { params: Promise<{ photoId: string }> }) {
  if (!requireAuth()) return unauthorized();
  const { photoId } = await ctx.params;
  const body = await req.json().catch(() => null);
  return editPhoto(photoId, body);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ photoId: string }> }) {
  if (!requireAuth()) return unauthorized();
  const { photoId } = await ctx.params;
  return deletePhoto(photoId);
}
