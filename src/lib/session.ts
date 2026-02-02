import 'server-only';
import crypto from 'node:crypto';

export const SESSION_COOKIE_NAME = 'session-id';
const TTL_SEC = 60 * 60 * 24 * 30; // 30 дней

type SessionPayload = {
  email: string;
  role: string;
};

function b64url(buf: Buffer) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function unb64url(s: string) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

function sign(body: string, secret: string) {
  return b64url(crypto.createHmac('sha256', secret).update(body).digest());
}

export function makeSession(payload: SessionPayload) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET missing');

  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const body = b64url(Buffer.from(JSON.stringify({ ...payload, exp })));
  const sig = sign(body, secret);

  return {
    name: SESSION_COOKIE_NAME,
    value: `${body}.${sig}`,
    maxAge: TTL_SEC,
  };
}

export function readSession(token?: string): SessionPayload | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET missing');
  if (!token) return null;

  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = sign(body, secret);

  // timingSafeEqual требует одинаковую длину
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  let data: any;
  try {
    data = JSON.parse(unb64url(body).toString('utf8'));
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (!data?.exp || data.exp < now) return null;

  const email = String(data.email ?? '');
  const role = String(data.role ?? '');
  if (!email || !role) return null;

  return { email, role };
}
