import 'server-only';
import { cookies } from 'next/headers';
import { readSession, SESSION_COOKIE_NAME } from '@/lib/session';
import { unauthorized } from '@/server/helpers/http';

export async function requireAuth() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = readSession(token);
  return session ?? null;
}

type Handler<Ctx> = (req: Request, ctx: Ctx) => Promise<Response>;

export function withAuth<Ctx>(handler: Handler<Ctx>) {
  return async (req: Request, ctx: Ctx) => {
    if (!(await requireAuth())) return unauthorized();
    return handler(req, ctx);
  };
}
