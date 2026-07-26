import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';
import type { Event } from '../lib/types';

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [open, setOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setOpen(true));
      setImgIndex(0);
    } else {
      setOpen(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [event]);

  if (!event) return null;

  const hasMultipleImages = event.images.length > 1;

  return (
    <div
      className="modal-veil"
      onClick={onClose}
      style={{
        opacity: open ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="em-title"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        }}
      >
        <button className="close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        {/* ============ IMAGES ============ */}
        {event.images.length > 0 && (
          <div className="relative mb-5 md:mb-6 rounded-xl overflow-hidden h-[200px] md:h-[300px] bg-[var(--carbon)]">
            <img
              src={event.images[imgIndex]}
              alt={`Imagen de ${event.title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {hasMultipleImages && (
              <>
                <button
                  onClick={() => setImgIndex((imgIndex - 1 + event.images.length) % event.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                  aria-label="Imagen anterior"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => setImgIndex((imgIndex + 1) % event.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {event.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`}
                      aria-label={`Imagen ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute bottom-3 right-3 font-mono text-[11px] tracking-[0.12em] text-white/80 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {imgIndex + 1} / {event.images.length}
            </div>
          </div>
        )}

        {/* ============ CONTENT ============ */}
        {event.category && (
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent mb-2">
            {event.category}
          </div>
        )}

        <h2 id="em-title" className="text-[clamp(22px,6vw,36px)] leading-tight">{event.title}</h2>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-fg-mute font-mono text-[13px] md:text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(event.eventDate)}
          </span>
          {event.eventTime && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {event.eventTime}
            </span>
          )}
          {event.place && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {event.place}
            </span>
          )}
          {event.organizer && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {event.organizer}
            </span>
          )}
        </div>

        {event.description && (
          <p className="mt-5 text-fg-mute text-base leading-relaxed">
            {event.description}
          </p>
        )}
      </div>
    </div>
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
