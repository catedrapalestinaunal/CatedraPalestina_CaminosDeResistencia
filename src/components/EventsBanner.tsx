import { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEvents } from '../lib/useEvents';
import { EventModal } from './EventModal';
import type { Event } from '../lib/types';

export function EventsBanner() {
  const { events, loading } = useEvents({ defer: true });
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
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
    <>
      <section id="eventos" className="section md:py-[clamp(60px,10vh,120px)]">
        <div className="wrap">
          <div className="md:max-w-3xl md:mx-auto">
            <div
              className="relative overflow-hidden rounded-2xl bg-[var(--carbon)] min-h-[300px] md:min-h-[380px] cursor-pointer group"
              onClick={() => setModalEvent(current!)}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalles de ${current!.title}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalEvent(current!); } }}
            >
              {/* ============ BACKGROUND IMAGE ============ */}
              {bgImage && (
                <div className="absolute inset-0">
                  <img
                    src={bgImage}
                    alt=""
                    className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--carbon)]/80 via-[var(--carbon)]/50 to-transparent" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

              {/* ============ CONTENT ============ */}
              <div className="relative z-10 p-6 md:p-10 lg:p-12 flex flex-col justify-center min-h-[300px] md:min-h-[380px]">
                <div
                  className="max-w-lg mx-auto transition-opacity duration-200 ease-out"
                  style={{ opacity: fade ? 1 : 0 }}
                >
                  {current!.category && (
                    <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--gold-accent)] mb-3">
                      {current!.category}
                    </div>
                  )}

                  <h2 className="font-serif text-[clamp(22px,3.5vw,38px)] leading-[1.08] text-white">
                    {current!.title}
                  </h2>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-white/70 font-mono text-[13px] md:text-xs">
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
                    <p className="mt-3 text-white/70 text-sm md:text-base leading-relaxed max-w-prose line-clamp-2">
                      {current!.description}
                    </p>
                  )}

                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-white/60 group-hover:text-white transition-colors">
                      Ver detalles
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>

              {/* ============ NAVEGACIÓN ============ */}
              {hasMultiple && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                    aria-label="Evento anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                    aria-label="Siguiente evento"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                    {events.map((e, i) => (
                      <button
                        key={e.id}
                        onClick={(ev) => { ev.stopPropagation(); go(i); }}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${i === index ? 'bg-white w-3 md:w-5' : 'bg-white/40 hover:bg-white/60'}`}
                        aria-label={`Evento ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />
    </>
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
