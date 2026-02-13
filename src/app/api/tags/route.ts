import 'server-only';
import { prisma } from '@/lib/prisma';
import { ok, badRequest } from '@/server/helpers/http';
import { revalidateTagsImpact } from '@/lib/cache-paths';
import { withAuth } from '@/server/helpers/auth';

export async function GET(_req: Request) {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return ok(tags);
}

export const POST = withAuth(async (req: Request) => {
  const body = await req.json().catch(() => null);

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!name) return badRequest('name required');

  const color =
    body?.color === null ? null : typeof body?.color === 'string' ? body.color : undefined;

  // upsert по name (name должен быть @unique в schema)
  const tag = await prisma.tag.upsert({
    where: { name },
    create: {
      name,
      color: typeof color === 'string' ? color : '#FFFFFF',
    },
    update: {
      ...(typeof color !== 'undefined' ? { color } : {}),
    },
  });

  revalidateTagsImpact({ tagId: tag.id });

  return ok(tag, { status: 201 });
});
