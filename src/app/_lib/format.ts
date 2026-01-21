export function fmtDate(d: string | null | undefined) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
}

export function markdownPreview(md: string, maxLen = 220) {
  const s = (md ?? "").trim();
  if (!s) return "";
  return s.length > maxLen ? s.slice(0, maxLen).trim() + "…" : s;
}
