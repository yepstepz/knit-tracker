// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readSession, SESSION_COOKIE_NAME } from '@/lib/session';

export function proxy(request: NextRequest) {
  // пути, требующие авторизации
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token || !readSession(token)) {
    const loginUrl = new URL(`/login?from=${request.nextUrl.pathname}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/create',
    '/projects/:projectId/edit',
    '/projects/:projectId/log/create',
    '/projects/:projectId/log/:logId/edit',
  ],
};
