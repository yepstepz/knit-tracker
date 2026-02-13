import { editPhoto } from './_lib/editPhoto';
import { deletePhoto } from './_lib/deletePhoto';
import { withAuth } from '@/server/helpers/auth';

export const PATCH = withAuth(async (req: Request, ctx: { params: Promise<{ photoId: string }> }) => {
  const { photoId } = await ctx.params;
  const body = await req.json().catch(() => null);
  return editPhoto(photoId, body);
});

export const DELETE = withAuth(async (_req: Request, ctx: { params: Promise<{ photoId: string }> }) => {
  const { photoId } = await ctx.params;
  return deletePhoto(photoId);
});
