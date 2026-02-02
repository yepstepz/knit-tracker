import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { ok, badRequest, notFound } from '@/server/helpers/http';
import { makeSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? '').trim();
  const password = String(body?.password ?? '');

  if (!email || !password) return badRequest('Email and password required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return notFound('invalid credentials');

  const pepper = process.env.ADMIN_PEPPER ?? '';
  const passOk = await bcrypt.compare(password + pepper, user.passwordHash);
  if (!passOk) return notFound('invalid credentials');

  const { name, value, maxAge } = makeSession({ email: user.email, role: user.role });

  const res = ok({ ok: true });
  res.cookies.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  return res;
}
