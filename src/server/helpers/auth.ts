import 'server-only';
import { cookies } from 'next/headers';
import { readSession, SESSION_COOKIE_NAME } from '@/lib/session';

export function requireAuth() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = readSession(token);
  return session ?? null;
}
