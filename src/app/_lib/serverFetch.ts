export async function apiGet<T>(path: string): Promise<T> {
  const base = process.env.INTERNAL_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}${path}`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}
