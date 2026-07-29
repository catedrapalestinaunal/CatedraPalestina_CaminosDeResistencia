import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/history.css';
import { Reveal } from '../components/Reveal';
import { MythCards } from '../components/MythCards';
import { ProjectModal } from '../components/ProjectModal';
import { Icon } from '../lib/icons';
import { ImageBook } from '../components/ImageBook';
import { TIMELINE, GLOSSARY } from '../data/history';
import { MYTHS_DATA } from '../data/myths';
import { TIMELINE_G3 } from '../data/timeline-g3';
import { SITE_URL, ogPageUrl } from '../lib/seo';
import { OgMeta } from '../components/OgMeta';
import { useProjects } from '../lib/useProjects';
import { articleSchema, eventSchema, breadcrumbSchema, faqSchema } from '../lib/seo-schema';
import { CONFIG } from '../lib/config';
import type { Project } from '../lib/types';

export function History() {
  const { projects } = useProjects();
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(-1);
  const [openProj, setOpenProj] = useState<Project | null>(null);
  const [isWide, setIsWide] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isWide) return;
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [isWide]);

  const scroll = (dir: number) => {
    if (!isWide) return;
    railRef.current?.scrollBy({ left: dir * 384, behavior: 'smooth' });
  };

  return (
    <>
      <OgMeta
        title="Historia · Cátedra Caminos de Resistencia"
        description="Línea histórica de Palestina desde 1917: Nakba 1948, Declaración Balfour y mitos del conflicto palestino-israelí. Cronología, glosario crítico y cartografía de la Cátedra Caminos de Resistencia."
        url={`${SITE_URL}/historia`}
        type="article"
        image={ogPageUrl('Historia', 'Raíces Milenarias')}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify([
            breadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'Historia', url: '/historia' },
            ]),
            faqSchema(MYTHS_DATA.map(m => ({
              question: m.myth,
              answer: m.reality,
            }))),
            articleSchema(
              'Raíces milenarias · Historia de Palestina',
              'Línea histórica de Palestina desde 1917: Nakba 1948, Declaración Balfour y mitos del conflicto palestino-israelí.',
              '2025'
            ),
            ...TIMELINE.filter(t => t.major).map(t =>
              eventSchema(t.title, t.year, t.body)
            ),
          ])}
        </script>
      </Helmet>
      <header className="page-head">
        <div className="wrap">
          <div className="row">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" /><span>Página 03 · Historia</span></div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="mt-4">
                  Raíces<br />
                  <em className="italic text-accent">milenarias</em>
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="lede">
                Una línea histórica que se lee en horizontal, como un olivar:
                las raíces no aparecen primero, pero son lo que sostiene la copa.
                <br /><br />
                <strong>Desplázate hacia la derecha.</strong>
              </p>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ============ TIMELINE ============ */}
      <section className="section pt-0">
        <div className="timeline-rail" ref={railRef}>
          <div className="timeline-track">
            {TIMELINE.map((t, i) => (
              <div key={i} className={'tl-node ' + (t.major ? 'is-major' : '')}>
                <div className={'tl-year ' + (t.major ? 'is-terra' : '')}>{t.year}</div>
                <div className="tl-title">{t.title}</div>
                <div className="tl-body">{t.body}</div>
                <div className="tl-meta">
                  {t.tags.map((tg, j) => <span key={j}>{tg}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="wrap">
          <div className="timeline-controls">
            <div className="flex gap-2">
              <button className="icon-btn" onClick={() => scroll(-1)} aria-label="Anterior">
                <Icon.ArrowLeft />
              </button>
              <button className="icon-btn" onClick={() => scroll(1)} aria-label="Siguiente">
                <Icon.Arrow />
              </button>
            </div>
            <div className="timeline-progress">
              <span style={{ width: `${Math.max(progress * 100, 8)}%` }} />
            </div>
            <div className="font-mono text-xs md:text-[11px] tracking-[0.14em] uppercase text-fg-mute min-w-[72px] md:min-w-[80px] text-right">
              {Math.round(progress * 100)}% leído
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAP CALLOUT ============ */}
      <section id="timeline-g3" className="section bg-[var(--bg-warm)]">
        <div className="wrap">
          <div className="grid-2">
            <Reveal>
              <div className="eyebrow"><span className="dot" /><span>Cartografía · Grupo 3 · {CONFIG.SEMESTRE}</span></div>
              <h2 className="mt-5 text-[clamp(28px,7vw,56px)] leading-tight">
                La historia <em className="text-accent italic">—también—</em> se lee en páginas.
              </h2>
              <p className="mt-4 text-fg-mute text-base leading-relaxed max-w-full md:max-w-[48ch]">
                Una línea de tiempo elaborada por el Grupo 3 que abarca desde las civilizaciones
                cananeas hasta la época contemporánea. Haz clic para abrir el visor y explorar
                cada sección con zoom y desplazamiento libre.
              </p>
            </Reveal>
            <ImageBook
              src={TIMELINE_G3.src}
              alt={TIMELINE_G3.alt}
              label={TIMELINE_G3.label}
              credit={TIMELINE_G3.credit}
              naturalWidth={TIMELINE_G3.naturalWidth}
              naturalHeight={TIMELINE_G3.naturalHeight}
            />
          </div>
        </div>
      </section>

      {/* ============ MITOS VS. REALIDAD ============ */}
      <section className="section">
        <div className="wrap">
          <div className="myth-section-head">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" /><span>Mitos vs. Realidad</span></div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5">
                  Cuatro mitos<br />
                  <em className="text-accent italic">—que no resisten</em><br />
                  los archivos
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="text-fg-mute text-base leading-relaxed max-w-[44ch]">
                El relato hegemónico sobre Palestina descansa en una serie de afirmaciones
                repetidas como hechos. Interactúa con cada tarjeta para confrontarlas
                con la evidencia documental.
              </p>
            </Reveal>
          </div>
          <MythCards />

          <Reveal delay={0.2}>
            <div className="mt-12 text-center">
              <Link to="/voces" className="btn">
                Arte y cultura como resistencia <span className="inline-block ml-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ GLOSSARY ============ */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow mb-5">
              <span className="dot" /><span>Glosario crítico · pulsa para abrir</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mb-10">
              Tres palabras <em className="text-accent italic">—que</em> conviene leer despacio
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glossary">
              {GLOSSARY.map((g, i) => (
                <div
                  key={i}
                  className={'gloss-item ' + (open === i ? 'is-open' : '')}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === i ? -1 : i); } }}
                >
                  <div className="term">
                    <span>{g.term}</span>
                    <span className="arrow">{open === i ? '—' : '↗'}</span>
                  </div>
                  <div className="author">{g.author}</div>
                  <div className="def">{g.def}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-12 text-center">
              <Link to="/ongs" className="btn terra">
                Organizaciones que trabajan en Palestina <span className="inline-block ml-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ RECURSOS ESTUDIANTILES ============ */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <h2 className="hr-rule mb-10">
              <span>Recursos elaborados por estudiantes {CONFIG.SEMESTRE}</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 3,
                title: 'Línea de Tiempo: Territorio Palestino',
                body: 'Línea de tiempo física de 3 pliegos que recorre la historia del territorio palestino desde las civilizaciones cananeas (3500 a.C.) hasta la época contemporánea. Ahora disponible como visor interactivo en esta misma página.',
                group: 'Grupo 3',
              },
              {
                id: 14,
                title: 'Galería multimedia en tres formatos',
                body: 'Tres estaciones —Gaza, Jerusalén Este y Cisjordania— con fotografías, narrativas de vida y poemas de autoría palestina que documentan el genocidio en tiempo y espacio.',
                group: 'Grupo 14',
              },
              {
                id: 13,
                title: 'Podcast Voces Palestina',
                body: 'Ep. 1: Introducción histórica y Ep. 2: Vida cotidiana bajo ocupación. Serie completa de 4 episodios del Grupo 13.',
                group: 'Grupo 13',
              },
            ].map(({ id, title, group }, i) => {
              const proj = projects.find(p => p.id === id);
              return (
                <Reveal key={id} as="article" delay={i * 0.08}>
                  <div className="card" role="button" tabIndex={0} onClick={() => { if (proj) setOpenProj(proj); }} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && proj) { e.preventDefault(); setOpenProj(proj); } }}>
                    <div className="kicker">{group}</div>
                    <div className="mt-1 font-mono text-[12px] sm:text-[10px] tracking-[0.1em] text-fg-mute">{proj ? ({ ensayo: 'Ensayo', cartografia: 'Cartografía', video: 'Video', podcast: 'Podcast', fanzine: 'Fanzine', mural: 'Mural', collage: 'Collage', grabado: 'Grabado' } as Record<string, string>)[proj.kind] || proj.kind : ''}</div>
                    <h3 className="mt-2 text-[clamp(16px,1.6vw,20px)] font-serif leading-tight">
                      {title}
                    </h3>
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      {id === 3 ? (
                        <a href="#timeline-g3" className="btn terra w-full justify-center">
                          Ver recurso
                        </a>
                      ) : (
                        <Link to="/archivo" className="btn terra w-full justify-center">
                          Ver en Archivo
                        </Link>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ READING NOTE ============ */}
      <section className="section pt-6">
        <div className="wrap">
          <Reveal className="reading-note">
            <div>
              <div className="font-mono text-xs md:text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--on-dark-mute)' }}>
                Nota de método
              </div>
              <p className="font-serif text-[clamp(20px,5.5vw,28px)] mt-3 leading-snug max-w-full md:max-w-[44ch]">
                Las fechas no son la historia. Son la cuadrícula que permite distinguir
                una continuidad de una novedad — y abre la pregunta verdadera: <em>¿quién?</em>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ProjectModal project={openProj} onClose={() => setOpenProj(null)} />
    </>
  );
}
