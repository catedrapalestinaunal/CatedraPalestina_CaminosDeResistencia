import { useCallback, useEffect, useRef, useState } from 'react';
import { toEvent } from './mapper';
import type { Event } from './types';

async function getSupabase() {
  const { supabase } = await import('./supabase');
  return supabase;
}

const CACHE_KEY = 'cdr-events-cache';
const CACHE_META_KEY = 'cdr-events-cache-meta';
const CACHE_VERSION = 1;
const CACHE_TTL = 5 * 60 * 1000;

interface CacheMeta {
  version: number;
  timestamp: number;
}

function loadCache(): Event[] | null {
  try {
    const metaRaw = localStorage.getItem(CACHE_META_KEY);
    if (!metaRaw) return null;
    const meta: CacheMeta = JSON.parse(metaRaw);
    if (meta.version !== CACHE_VERSION) return null;
    if (Date.now() - meta.timestamp > CACHE_TTL) return null;

    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Event[]) : null;
  } catch {
    return null;
  }
}

function saveCache(events: Event[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(events));
    localStorage.setItem(CACHE_META_KEY, JSON.stringify({
      version: CACHE_VERSION,
      timestamp: Date.now(),
    }));
  } catch { /* quota exceeded — ignore */ }
}

interface UseEventsResult {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function idle(fn: () => void) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn, { timeout: 4000 });
  } else {
    setTimeout(fn, 1500);
  }
}

export function useEvents({ defer }: { defer?: boolean } = {}): UseEventsResult {
  const [initial] = useState(() => loadCache());
  const [events, setEvents] = useState<Event[]>(() => initial ?? []);
  const [loading, setLoading] = useState(() => defer ? false : !initial);
  const [error, setError] = useState<string | null>(null);
  const fetchCount = useRef(0);

  const fetch = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache();
      if (cached) {
        setEvents(cached);
        return;
      }
    }

    fetchCount.current += 1;
    const currentFetch = fetchCount.current;

    setLoading(true);
    setError(null);

    const sb = await getSupabase();
    const today = new Date().toISOString().split('T')[0];
    const { data, error: err } = await sb
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true });

    if (currentFetch !== fetchCount.current) return;

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    const mapped = (data ?? []).map(toEvent);
    setEvents(mapped);
    saveCache(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (defer) {
      idle(() => fetch());
    } else {
      fetch();
    }
  }, [fetch, defer]);

  return { events, loading, error, refetch: () => fetch(true) };
}
