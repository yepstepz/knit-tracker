import { NextRequest } from 'next/server';

import { ok } from '@/server/helpers/http';
import { readSession, SESSION_COOKIE_NAME } from '@/lib/session';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sess = readSession(token);
  return ok(sess ? { email: sess.email, role: sess.role } : null);
}
