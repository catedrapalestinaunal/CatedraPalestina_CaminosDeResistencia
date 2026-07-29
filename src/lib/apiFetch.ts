import { getSupabase } from './getSupabase';

interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ApiFetchResult<T = unknown> {
  ok: boolean;
  data: T | null;
  error: string | null;
  status: number;
}

const RETRY_DELAY = 2000;

export async function apiFetch<T = unknown>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<ApiFetchResult<T>> {
  const token = await getToken();
  if (!token) {
    redirectLogin();
    return { ok: false, data: null, error: 'Sesión expirada', status: 401 };
  }

  const hasBody = options.body !== undefined && options.method !== 'GET' && options.method !== 'DELETE';
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    method: options.method ?? 'GET',
    headers,
    ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
  };

  async function attempt(): Promise<ApiFetchResult<T>> {
    let res: Response;
    try {
      res = await fetch(url, fetchOptions);
    } catch {
      return { ok: false, data: null, error: 'Error de conexión. Verifica tu internet e intenta de nuevo.', status: 0 };
    }

    if (res.status === 401) {
      redirectLogin();
      return { ok: false, data: null, error: 'Tu sesión expiró. Vuelve a iniciar sesión.', status: 401 };
    }

    try {
      const body = await res.json();
      if (res.ok) {
        return { ok: true, data: body as T, error: null, status: res.status };
      }
      const msg = body.error ?? 'Error del servidor';
      return { ok: false, data: null, error: msg, status: res.status };
    } catch {
      const msg = res.ok ? 'Respuesta vacía del servidor' : 'El servidor no responde. Intenta de nuevo.';
      return { ok: false, data: null, error: msg, status: res.status };
    }
  }

  const result = await attempt();

  if (!result.ok && result.status >= 500) {
    await new Promise(r => setTimeout(r, RETRY_DELAY));
    return attempt();
  }

  return result;
}

async function getToken(): Promise<string | null> {
  try {
    const sb = await getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

function redirectLogin() {
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
    window.location.href = '/admin/login';
  }
}
