import 'server-only';

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export function parsePositiveInt(value: string | null, fallback: number) {
  if (value === null) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
