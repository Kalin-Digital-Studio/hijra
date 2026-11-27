export type Resource = 'prayer' | 'calendar' | 'hadith' | 'dua' | 'husna' | 'quran';
export const permissions: Record<Resource, { live: 'UNVERIFIED'; cache: 'UNVERIFIED'; bundle: 'UNVERIFIED' }> = {
  prayer: { live: 'UNVERIFIED', cache: 'UNVERIFIED', bundle: 'UNVERIFIED' },
  calendar: { live: 'UNVERIFIED', cache: 'UNVERIFIED', bundle: 'UNVERIFIED' },
  hadith: { live: 'UNVERIFIED', cache: 'UNVERIFIED', bundle: 'UNVERIFIED' },
  dua: { live: 'UNVERIFIED', cache: 'UNVERIFIED', bundle: 'UNVERIFIED' },
  husna: { live: 'UNVERIFIED', cache: 'UNVERIFIED', bundle: 'UNVERIFIED' },
  quran: { live: 'UNVERIFIED', cache: 'UNVERIFIED', bundle: 'UNVERIFIED' },
};
export const canPreviewMyQuran = typeof __DEV__ !== 'undefined' && __DEV__;
export class IslamicError extends Error {
  readonly reason: 'blocked'|'network'|'timeout'|'aborted'|'schema'|'http';
  readonly status?: number;
  constructor(reason: IslamicError['reason'], status?: number) {
    super(reason);
    this.reason = reason;
    this.status = status;
  }
}
const base = 'https://api.myquran.com';
let rateLimitedUntil = 0;
const requests = new Map<string, { controller: AbortController; subscribers: number; promise: Promise<unknown> }>();
export function object(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new IslamicError('schema');
  return value as Record<string, unknown>;
}
export function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new IslamicError('schema');
  return value;
}
export function string(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) throw new IslamicError('schema');
  return value;
}
async function fetchJson(path: string, signal: AbortSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort);
  const timeout = setTimeout(abort, 8000);
  try {
    for (let attempt=0; attempt<2; attempt++) {
      if (Date.now()<rateLimitedUntil) throw new IslamicError('http',429);
      const response = await fetch(base+path, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (response.status===429) {
        const retry = response.headers.get('Retry-After');
        const deadline = retry && /^\d+$/.test(retry) ? Date.now()+Number(retry)*1000 : Date.parse(retry ?? '');
        rateLimitedUntil = Number.isFinite(deadline) ? Math.max(Date.now(),deadline) : Date.now()+30000;
      }
      if (!response.ok) {
        if (attempt===0 && [500,502,503,504].includes(response.status) && !response.headers.has('Retry-After')) continue;
        throw new IslamicError('http',response.status);
      }
      let raw: unknown;
      try { raw = await response.json(); } catch { throw new IslamicError('schema'); }
      const result = object(raw);
      if (result.status!==true || result.data===undefined) throw new IslamicError('schema');
      return result.data;
    }
    throw new IslamicError('network');
  } catch (error) {
    if (signal.aborted) throw new IslamicError('aborted');
    if (controller.signal.aborted) throw new IslamicError('timeout');
    throw error instanceof IslamicError ? error : new IslamicError('network');
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort',abort);
  }
}
export function request(resource: Resource, path: string, signal: AbortSignal): Promise<unknown> {
  if (!canPreviewMyQuran || permissions[resource].live !== 'UNVERIFIED') return Promise.reject(new IslamicError('blocked'));
  if (!/^\/v[23]\//.test(path) || signal.aborted) return Promise.reject(new IslamicError('aborted'));
  let entry = requests.get(path);
  if (!entry || entry.controller.signal.aborted) {
    const controller = new AbortController();
    const promise = fetchJson(path, controller.signal).finally(() => {
      if (requests.get(path)?.controller===controller) requests.delete(path);
    });
    entry = { controller, subscribers: 0, promise };
    requests.set(path,entry);
  }
  const active = entry;
  active.subscribers++;
  return new Promise((resolve,reject) => {
    const cancel = () => { release(); reject(new IslamicError('aborted')); };
    function release() {
      signal.removeEventListener('abort',cancel);
      if (--active.subscribers===0 && requests.get(path)===active) active.controller.abort();
    }
    signal.addEventListener('abort',cancel,{ once: true });
    active.promise.then((value) => { if (!signal.aborted) { release(); resolve(value); } },
      (error) => { if (!signal.aborted) { release(); reject(error); } });
  });
}
