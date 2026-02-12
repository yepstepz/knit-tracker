import 'server-only';

export function toDateOrUndefined(value: unknown) {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
