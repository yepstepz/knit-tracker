type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type ApiFetchOptions<B = unknown> = {
  method?: HttpMethod;
  /** если передан объект — отправим как JSON */
  body?: B;
  headers?: HeadersInit;
  /** по умолчанию no-store (как у тебя) */
  cache?: RequestCache;
  /** next/fetch options для Next.js (опционально) */
  next?: RequestInit["next"];
  /** credentials, signal и т.п. */
  credentials?: RequestCredentials;
  signal?: AbortSignal;

  /**
   * Если true — не парсим JSON и не читаем тело, просто проверяем ok.
   * Удобно для DELETE/POST без ответа.
   */
  noBody?: boolean;

  /**
   * По умолчанию true:
   * - на сервере добавляет INTERNAL_BASE_URL/localhost
   * - на клиенте остаётся относительным
   */
  useInternalBaseUrl?: boolean;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !(value instanceof FormData) && !(value instanceof Blob);
}

function resolveUrl(path: string, useInternalBaseUrl: boolean) {
  // абсолютный url уже есть
  if (/^https?:\/\//i.test(path)) return path;

  const isServer = typeof window === "undefined";
  if (!useInternalBaseUrl || !isServer) return path;

  const base = process.env.INTERNAL_BASE_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Универсальный fetch для API */
export async function apiFetch<T = unknown, B = unknown>(
  path: string,
  opts: ApiFetchOptions<B> = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers,
    cache = "no-store",
    next,
    credentials,
    signal,
    noBody = false,
    useInternalBaseUrl = true,
  } = opts;

  const url = resolveUrl(path, useInternalBaseUrl);

  const init: RequestInit = {
    method,
    cache,
    next,
    credentials,
    signal,
    headers: { ...(headers ?? {}) },
  };

  if (body !== undefined) {
    if (isPlainObject(body)) {
      // JSON body
      (init.headers as Record<string, string>)["Content-Type"] =
        (init.headers as Record<string, string>)["Content-Type"] ?? "application/json";
      init.body = JSON.stringify(body);
    } else {
      // FormData / Blob / string / etc.
      init.body = body as any;
    }
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  }

  if (noBody) return undefined as T;

  // Если 204 No Content или пустое тело — вернём undefined
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  // не JSON — вернём текст (можно типизировать как string)
  return (await res.text()) as unknown as T;
}
