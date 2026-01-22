import 'server-only';

export function nonEmptyString(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s.length ? s : null;
}

export function optionalStringOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  return typeof v === 'string' ? v : null;
}

export function optionalInt(v: unknown): number | null {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  return Math.trunc(v);
}

export function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
