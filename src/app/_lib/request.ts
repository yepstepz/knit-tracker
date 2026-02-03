import { apiFetch } from './apiFetch';

export const apiGet = <T>(path: string) => apiFetch<T>(path, { method: 'GET' });
export const apiGetCached = <T>(path: string, opts: { revalidate: number }) =>
  apiFetch<T>(path, {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: opts.revalidate },
  });

export const apiDelete = (path: string) => apiFetch<void>(path, { method: 'DELETE', noBody: true });

/** POST без ответа (по умолчанию) */
export const apiPost = <B = unknown>(path: string, body?: B, skipAuthCheck: boolean = false) =>
  apiFetch<void, B>(path, { method: 'POST', body, noBody: true, skipAuthCheck });

/** PATCH без ответа (по умолчанию) */
export const apiPatch = <B = unknown>(path: string, body?: B) =>
  apiFetch<void, B>(path, { method: 'PATCH', body, noBody: true });

/** PUT без ответа (по умолчанию) */
export const apiPut = <B = unknown>(path: string, body?: B) =>
  apiFetch<void, B>(path, { method: 'PUT', body, noBody: true });

/** POST с JSON-ответом */
export const apiPostWithResponse = <T, B = unknown>(path: string, body?: B) =>
  apiFetch<T, B>(path, { method: 'POST', body });

/** PATCH с JSON-ответом (если понадобится) */
export const apiPatchWithResponse = <T, B = unknown>(path: string, body?: B) =>
  apiFetch<T, B>(path, { method: 'PATCH', body });

/** PUT с JSON-ответом (если понадобится) */
export const apiPutWithResponse = <T, B = unknown>(path: string, body?: B) =>
  apiFetch<T, B>(path, { method: 'PUT', body });
