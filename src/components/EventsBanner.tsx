import { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useEvents } from '../lib/useEvents';
import type { Event } from '../lib/types';

export function EventsBanner() {
  const { events, loading } = useEvents({ defer: true });
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();

  const len = events.length;
  const hasMultiple = len > 1;
  const current: Event | undefined = events[index];

  const go = useCallback((i: number) => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setFade(false);
    fadeTimer.current = setTimeout(() => {
      setIndex(i);
      setFade(true);
    }, 200);
  }, []);

  const next = useCallback(() => go((index + 1) % len), [go, index, len]);
  const prev = useCallback(() => go((index - 1 + len) % len), [go, index, len]);

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [hasMultiple, next]);

  if (loading) return null;
  if (events.length === 0) return null;

  const bgImage = current!.images.length > 0 ? current!.images[0] : null;

  return (
    <section id="eventos" className="section pt-0">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--carbon)] min-h-[320px] md:min-h-[400px]">
          {/* ============ BACKGROUND IMAGE ============ */}
          {bgImage && (
            <div className="absolute inset-0">
              <img
                src={bgImage}
                alt=""
                className="w-full h-full object-cover opacity-50"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--carbon)] via-[var(--carbon)]/60 to-transparent" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* ============ CONTENT ============ */}
          <div className="relative z-10 p-6 md:p-10 lg:p-14 flex flex-col justify-end min-h-[320px] md:min-h-[400px]">
            <div
              className="max-w-2xl transition-opacity duration-200 ease-out"
              style={{ opacity: fade ? 1 : 0 }}
            >
              {current!.category && (
                <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--gold-accent)] mb-3">
                  {current!.category}
                </div>
              )}

              <h2 className="font-serif text-[clamp(24px,4vw,44px)] leading-[1.08] text-white">
                {current!.title}
              </h2>

              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-white/70 font-mono text-[13px] md:text-xs">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(current!.eventDate)}
                </span>
                {current!.eventTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {current!.eventTime}
                  </span>
                )}
                {current!.place && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {current!.place}
                  </span>
                )}
                {current!.organizer && (
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {current!.organizer}
                  </span>
                )}
              </div>

              {current!.description && (
                <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed max-w-prose line-clamp-3 md:line-clamp-2">
                  {current!.description}
                </p>
              )}
            </div>
          </div>

          {/* ============ NAVIGATION ============ */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                aria-label="Evento anterior"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                aria-label="Siguiente evento"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {events.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => go(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                    aria-label={`Evento ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
