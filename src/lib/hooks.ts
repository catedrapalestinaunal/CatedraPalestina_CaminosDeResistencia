import { useEffect, useState } from 'react';

let lockCount = 0;

export function useLockBodyScroll(shouldLock: boolean) {
  useEffect(() => {
    if (shouldLock) {
      if (lockCount === 0) {
        document.body.style.overflow = 'hidden';
      }
      lockCount++;
      return () => {
        lockCount--;
        if (lockCount === 0) {
          document.body.style.overflow = '';
        }
      };
    }
  }, [shouldLock]);
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}
