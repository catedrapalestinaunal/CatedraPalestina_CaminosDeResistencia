import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../lib/icons';
import { generateAPA } from '../lib/citation';
import type { Project } from '../lib/types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  hideArchiveLink?: boolean;
}

const KIND_GLYPH: Record<string, string> = {
  ensayo: 'E', cartografia: 'C', video: 'V', podcast: 'P',
  fanzine: 'F', mural: 'M', collage: 'CL', grabado: 'G',
};

const KIND_LABEL: Record<string, string> = {
  ensayo: 'Leer ensayo', cartografia: 'Explorar mapa', video: 'Ver video',
  podcast: 'Escuchar podcast', fanzine: 'Ver fanzine', mural: 'Ver mural',
  collage: 'Ver collage', grabado: 'Ver grabado',
};

export function ProjectModal({ project, onClose, hideArchiveLink }: ProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setOpen(true));
      modalRef.current?.focus();
      setExpandedLinks(false);
    } else {
      setOpen(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  if (!project) return null;

  const p = project;

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
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        }}
      >
        <button className="close" onClick={onClose} aria-label="Cerrar">
          <Icon.Close />
        </button>

        <div className="relative mb-5 md:mb-6 rounded-xl overflow-hidden h-[200px] md:h-[260px] bg-[var(--olive)]">
          {p.thumbnail ? (
            <img src={p.thumbnail} alt={`Miniatura de ${p.title}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-[clamp(60px,10vw,100px)] opacity-15 select-none text-white">
                {KIND_GLYPH[p.kind] || p.kind.toUpperCase()}
              </span>
            </div>
          )}
          {p.aiThumbnail && (
            <div className="absolute top-3 left-4 z-10 font-mono text-[11px] md:text-[10px] tracking-[0.12em] uppercase text-white/70 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              AI · ref.
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-4 font-mono text-[12px] tracking-[0.15em] uppercase text-white/90">
            {p.kind} · {p.year}
          </div>
          <div className="absolute bottom-3 right-4 md:top-3 md:right-4 md:bottom-auto font-mono text-[11px] tracking-[0.12em] uppercase text-white/80 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            N° {p.n}
          </div>
        </div>
        <h2 id="pm-title" className="mt-3 text-[clamp(22px,6vw,36px)] leading-tight">{p.title}</h2>
        <div className="text-fg-mute mt-2 text-base md:text-sm">{p.author}</div>

        {p.group && (
          <div className="mt-3 font-mono text-xs tracking-[0.12em] uppercase text-accent">{p.group}</div>
        )}

        <p className="mt-4 md:mt-5 text-fg-mute text-base leading-relaxed">
          {p.description || 'Proyecto desarrollado en el marco del módulo final de la cátedra.'}
        </p>

        {p.members && p.members.length > 0 && (
          <div className="mt-4">
            <div className="font-mono text-[12px] tracking-[0.14em] uppercase text-fg-mute mb-1.5">Integrantes</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-mute">
              {p.members.map((m, i) => (
                <span key={i}>{m}{i < p.members!.length - 1 ? ' · ' : ''}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2.5 mt-6 flex-wrap">
          {p.links && p.links.length > 0 && p.linkLabel ? (
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn terra" onClick={() => setExpandedLinks(!expandedLinks)}>
                  {p.linkLabel}
                  <span className={'inline-block transition-transform duration-200 ' + (expandedLinks ? 'rotate-180' : '')}>▾</span>
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    navigator.clipboard.writeText(generateAPA(p));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2200);
                  }}
                >
                  {copied ? 'Copiado ✓' : 'Copiar cita APA'}
                </button>
              </div>
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  maxHeight: expandedLinks ? '500px' : '0px',
                  opacity: expandedLinks ? 1 : 0,
                  transition: 'max-height 0.25s ease-in-out, opacity 0.25s ease-in-out',
                }}
              >
                <div className="border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] overflow-hidden">
                  {p.links.map((l, i) => (
                    <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 justify-between w-full text-left p-3 md:px-4 text-sm text-fg-mute hover:text-fg hover:bg-[var(--olive-soft)] transition-colors">
                      {l.label}
                      <span className="shrink-0 text-fg-mute"><Icon.External /></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : p.links && p.links.length > 0 ? (
            <>
              {p.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className={'btn' + (i === 0 ? ' terra' : '')}>
                  {l.label} <Icon.External />
                </a>
              ))}
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(generateAPA(p));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2200);
                }}
              >
                {copied ? 'Copiado ✓' : 'Copiar cita APA'}
              </button>
            </>
          ) : p.url ? (
            <>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn terra">
                {KIND_LABEL[p.kind] || 'Abrir documento'} <Icon.External />
              </a>
              {p.urlAlt && (
                <a href={p.urlAlt} target="_blank" rel="noopener noreferrer" className="btn">
                  Ver transcripción <Icon.External />
                </a>
              )}
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(generateAPA(p));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2200);
                }}
              >
                {copied ? 'Copiado ✓' : 'Copiar cita APA'}
              </button>
            </>
          ) : (
            <>
              <button className="btn" disabled>Próximamente</button>
              <button
                className="btn"
                onClick={() => {
                  navigator.clipboard.writeText(generateAPA(p));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2200);
                }}
              >
                {copied ? 'Copiado ✓' : 'Copiar cita APA'}
              </button>
            </>
          )}
          {!hideArchiveLink && (
            <Link to="/archivo" className="btn" onClick={onClose}>
              Ver en Archivo <Icon.Arrow />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
