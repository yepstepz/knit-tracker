import { NextRequest, NextResponse } from 'next/server';
import { readSession, SESSION_COOKIE_NAME } from '@/lib/session';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sess = readSession(token);
  return NextResponse.json(sess ? { email: sess.email, role: sess.role } : null);
}
