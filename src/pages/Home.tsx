import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { ImageSlot } from '../components/ImageSlot';
import { Icon } from '../lib/icons';
import { useLockBodyScroll } from '../lib/hooks';
import type { Project } from '../lib/types';
import { POETRY_PLAYLIST } from '../data/playlist';
import { useProjects } from '../lib/useProjects';
import { OG_IMAGE, SITE_URL, SITE_NAME, SITE_LOCALE } from '../lib/seo';
import { orgSchema, websiteSchema, courseSchema } from '../lib/seo-schema';
import { CONFIG } from '../lib/config';
import { useFocusTrap } from '../lib/useFocusTrap';

/* ============ YOUTUBE IFrame API TYPES ============ */
declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: YTPlayerConfig,
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

interface YTPlayerConfig {
  videoId?: string;
  playerVars?: {
    autoplay?: number;
    mute?: number;
    enablejsapi?: number;
    controls?: number;
    modestbranding?: number;
    rel?: number;
  };
  events?: {
    onReady?: () => void;
    onStateChange?: (event: { data: number }) => void;
  };
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
  destroy(): void;
}

export function Home() {
  const { projects, loading, error, refetch } = useProjects({ defer: true });
  const [openProj, setOpenProj] = useState<Project | null>(null);
  useLockBodyScroll(!!openProj);
  const modalRef = useFocusTrap(!!openProj, () => setOpenProj(null));
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const featuredIds = [3, 14, 25, 17, 23, 12];
  const featuredProjects = projects.filter(p => featuredIds.includes(p.id));

  return (
    <>
      <Helmet>
        <title>Cátedra Caminos de Resistencia · UNAL</title>
        <meta name="description" content="Cátedra Caminos de Resistencia · UNAL: plataforma de memoria y solidaridad académica Palestina Colombia. Espacio sentipensante de educación pública sobre Palestina desde Colombia. Repositorio de la Facultad de Derecho y Ciencias Políticas." />
        <meta property="og:title" content="Cátedra Caminos de Resistencia · UNAL" />
        <meta property="og:description" content="Cátedra Caminos de Resistencia · UNAL: plataforma de memoria y solidaridad académica Palestina Colombia. Espacio sentipensante de educación pública sobre Palestina." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={SITE_LOCALE} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cátedra Caminos de Resistencia · UNAL" />
        <meta name="twitter:description" content="Cátedra Caminos de Resistencia · UNAL: plataforma de memoria y solidaridad académica Palestina Colombia." />
        <link rel="canonical" href={SITE_URL} />
        <script type="application/ld+json">
          {JSON.stringify([orgSchema(), websiteSchema(), courseSchema()])}
        </script>
      </Helmet>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />

        <div className="olive-decor text-primary" aria-hidden="true">
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" stroke="currentColor" opacity="0.25">
            <path d="M40 280 Q 180 80, 290 30" strokeWidth="1.2" />
            <ellipse cx="80" cy="240" rx="14" ry="5" transform="rotate(-30 80 240)" fill="currentColor" stroke="none" />
            <ellipse cx="120" cy="190" rx="14" ry="5" transform="rotate(-40 120 190)" fill="currentColor" stroke="none" />
            <ellipse cx="160" cy="150" rx="14" ry="5" transform="rotate(-50 160 150)" fill="currentColor" stroke="none" />
            <ellipse cx="210" cy="100" rx="14" ry="5" transform="rotate(-60 210 100)" fill="currentColor" stroke="none" />
            <ellipse cx="260" cy="60" rx="14" ry="5" transform="rotate(-70 260 60)" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className="wrap w-full grid grid-cols-1 gap-x-8 gap-y-5 items-end md:grid-cols-[1fr_320px]">
          <div className="order-1 md:col-start-1 md:row-start-1">
            <div className="eyebrow"><span className="dot" /><span>Plataforma de Memoria y Solidaridad Académica · UNAL</span></div>
          </div>

          <div className="text-left md:text-right order-3 md:col-start-2 md:row-start-1 md:max-w-[320px] hidden sm:block">
            <div className="font-mono text-xs md:text-[11px] text-fg-mute tracking-[0.18em] uppercase mb-2.5">
              001 / Inicio
            </div>
          </div>

          <h1 className="hero-title order-2 md:order-3 md:col-span-2 md:mt-10 mt-1.5">
            <span className="neutral">Caminos</span><br />
            <em>de</em> Resistencia
          </h1>

          <div className="order-4 md:col-start-1 md:row-start-2">
            <div className="font-mono text-[13px] md:text-xs text-fg-mute tracking-[0.1em] leading-relaxed">
              Repositorio permanente · Facultad de Derecho y Ciencias Políticas
            </div>
          </div>

          <div className="text-left md:text-right order-5 md:col-start-2 md:row-start-2 md:max-w-[320px]">
            <div className="text-base md:text-sm text-fg-mute leading-relaxed">
              Un espacio sentipensante de educación pública desde Colombia, en solidaridad con Palestina.
            </div>
          </div>

          <div className="hero-foot order-6 md:col-span-2">
            <div className="stat">
              <span className="num">{loading && projects.length === 0 ? <span className="skeleton-num" aria-hidden="true">···</span> : projects.length}</span>
              <span className="lbl">{loading && projects.length === 0 ? 'Cargando...' : 'Proyectos · realizados'}</span>
            </div>
            <div className="stat">
              <span className="num text-accent">+{CONFIG.DESPOJO_ANOS}</span>
              <span className="lbl">Años · de despojo</span>
            </div>
            <div className="stat">
              <span className="num">{CONFIG.EDICION}</span>
              <span className="lbl">Ediciones · de la cátedra</span>
            </div>
            <div className="stat">
              <span className="num">∞</span>
              <span className="lbl">Sumud · firmeza</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="quote-section section">
        <div className="wrap">
          <div className="quote-grid">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" /><span>Apertura · Palabra fundacional</span></div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="pull-quote mt-7">
                  "Vengo con el <span className="leaf">fusil</span> del combatiente de la libertad en una mano
                  y la <span className="leaf">rama de olivo</span> en la otra.
                  No dejen que la rama de olivo caiga de mi mano."
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="quote-attrib">
                  — Yasser Arafat &nbsp;·&nbsp; Asamblea General de las Naciones Unidas &nbsp;·&nbsp; 13 · XI · 1974
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="quote-aside">
                {`Cincuenta y ${CONFIG.DESPOJO_ANOS - 26} años después, la rama de olivo sigue pendiente del aire.`} Esta cátedra
                recoge el gesto: <strong>nombrar lo que ocurre, sostener la memoria, sembrar futuro.</strong>
                <br /><br />
                Un acuerdo público entre estudiantes, docentes y comunidades —dentro y fuera de la universidad— para
                que el aula sea también territorio en disputa.
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MISSION ============ */}
      <section className="section">
        <div className="wrap">
          <div className="mission">
            <div>
              <Reveal>
                <h2 className="eyebrow"><span className="dot" /><span>Misión</span></h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-7 font-mono text-[13px] md:text-xs text-fg-mute">/ 02 — qué hacemos</div>
              </Reveal>
            </div>

            <div>
              <Reveal>
                <p className="lede">
                  Un espacio educativo <span className="accent">sentipensante</span> de la
                  Universidad Nacional de Colombia para fomentar la solidaridad frente al
                  exterminio, contra la indiferencia académica y a favor de un saber que
                  <em> piensa-con-el-cuerpo</em>.
                </p>
              </Reveal>

              <ul>
                {MISSION_POINTS.map((m, i) => (
                  <Reveal key={m.n} as="li" delay={(i + 1) * 0.08}>
                    <span className="n">/ {m.n}</span>
                    <span><b>{m.title}</b> {m.body}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STICKY STORY ============ */}
      <section className="section bg-[var(--bg-warm)]">
        <div className="wrap">
          <Reveal>
            <h2 className="eyebrow mb-10">
              <span className="dot" /><span>Programa · cuatro estaciones</span>
            </h2>
          </Reveal>

          <div className="sticky-story">
            <Reveal className="stick">
              <div className="story-slot !p-0 !h-auto">
                <ImageSlot
                  src="/images/home/ancient-olive-al-badawi.webp"
                  srcSet="/images/home/ancient-olive-al-badawi-480.webp 480w, /images/home/ancient-olive-al-badawi-768.webp 768w, /images/home/ancient-olive-al-badawi-1200.webp 1200w"
                  sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
                  alt="Salah Ali junto al colosal tronco del olivo al-Badawi en al-Walaja, uno de los árboles más antiguos del mundo."
                  credit="Fotografía documental por Jason Ruffin para Atlas Obscura. Exhibición con fines estrictamente pedagógicos, de memoria y de investigación académica en el entorno universitario (Uso Justo)."
                  label="Salah Ali y el olivo al-Badawi · al-Walaja"
                  variant="terra"
                  objectPosition="60% 50%"
                  height={450}
                  className="w-full group"
                />
              </div>
            </Reveal>

            <div>
              {STATIONS.map((s) => (
                <Reveal key={s.n}>
                  <div className="story-block">
                    <div className="kicker">/ Estación {s.n}</div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ POÉTICA DE LA TIERRA ============ */}
      <section className="poetica section">
        <div className="poetica-bg" aria-hidden="true" />
        <div className="wrap">
          <div className="poetica-grid">
            <div>
              <Reveal>
                <div className="eyebrow" style={{ color: 'var(--on-dark-mute)' }}>
                  <span className="dot" style={{ background: 'var(--gold-accent)' }} /><span>Poética de la Tierra · voces</span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="poetica-quote">
                  "Escribo el <span className="leaf">nombre</span> de mi tierra en el viento,
                  <br />pero el viento no sabe que mi tierra<br />
                  tiene <span className="leaf">nombre.</span>"
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="poetica-attrib">
                  — Mahmoud Darwish &nbsp;·&nbsp; <i>El lecho de una extranjera</i> &nbsp;·&nbsp; 1999
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-9 max-w-[46ch] text-base md:text-[15px] leading-[1.7] md:leading-[1.65]" style={{ color: 'var(--on-dark-fg)' }}>
                  Si el ocupante toma la tierra, el poeta nombra la tierra. Si el archivo
                  quema, el cantor recuerda. Esta cátedra recoge un cuerpo poético, musical
                  y cinematográfico que ha sostenido la palabra <i>Palestina</i> durante
                  medio siglo de borradura sistemática.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <AudioPlayer />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SIMBOLOGÍA Y RAÍCES ============ */}
      <section className="section">
        <div className="wrap">
          <div className="simbo-head">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" /><span>Simbología y Raíces</span></div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5">
                  Tres objetos<br />
                  <em className="text-accent italic">—que</em> dicen un pueblo
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="text-fg-mute text-base md:text-base leading-relaxed max-w-full md:max-w-[44ch]">
                Una semiótica popular acompaña a la causa palestina desde 1948.
                Tres signos —el olivo, la llave, la firmeza— operan como
                <strong className="text-fg font-medium"> contraseña, herencia y mandato.</strong>
              </p>
            </Reveal>
          </div>

          <div className="simbo-grid">
            <SimboCard
              n="01"
              term="El Olivo"
              meaning="Resiliencia"
              body="Árbol que puede vivir mil años. Arrancarlo es el gesto inverso a sembrarlo: un acto que necesita más violencia que tiempo. Por eso replantarlo, una y otra vez, es ya una forma de victoria."
              glyph={<OliveGlyph />}
            />
            <SimboCard
              n="02"
              term="La Llave"
              meaning="Derecho al retorno"
              body="Más de medio millón de familias guardan, desde 1948, la llave de la casa que les fue arrebatada. Pasa de padres a hijas como una promesa material: la casa existe porque la llave existe."
              glyph={<KeyGlyph />}
              accent
            />
            <SimboCard
              n="03"
              term="El Sumud"
              meaning="Firmeza"
              body="Palabra árabe sin traducción directa: estar, quedarse, no irse. La pedagogía de no abandonar el lugar — la escuela, el campo, la calle — incluso cuando estar implica peligro."
              glyph={<SumudGlyph />}
            />
          </div>
        </div>
      </section>

      {/* ============ COSECHA 2025-I ============ */}
      <section className="section pt-0 pb-20">
        <div className="wrap">
          <Reveal>
            <h2 className="hr-rule mb-10">
              <span>Cosecha {CONFIG.SEMESTRE} · proyectos destacados</span>
            </h2>
          </Reveal>

          {loading && projects.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Cargando proyectos">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card min-h-[180px]" aria-hidden="true">
                  <div className="h-4 bg-current/10 rounded w-2/3 mb-4" />
                  <div className="h-3 bg-current/10 rounded w-1/3 mb-6" />
                  <div className="h-5 bg-current/10 rounded w-full mb-2" />
                  <div className="h-5 bg-current/10 rounded w-4/5 mb-4" />
                  <div className="h-8 bg-current/10 rounded-full w-32" />
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16" role="alert">
              <p className="text-fg-mute mb-4">No pudimos cargar los proyectos destacados.</p>
              {typeof refetch === 'function' && (
                <button type="button" className="btn" onClick={refetch}>
                  Intentar de nuevo
                </button>
              )}
            </div>
          )}

          {!loading && !error && projects.length > 0 && featuredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-fg-mute">Los proyectos destacados no están disponibles actualmente.</p>
            </div>
          )}

          {featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((p, i) => (
                <Reveal key={p.id} as="article" delay={i * 0.06}>
                  <div className="card">
                    <div role="button" tabIndex={0} onClick={() => setOpenProj(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenProj(p); } }}>
                      <div className="kicker">{p.group || p.author}</div>
                      <div className="mt-1 font-mono text-[10px] tracking-[0.1em] text-fg-mute">{KIND_GLYPH_LOCAL[p.kind] || p.kind}</div>
                      <h3 className="mt-2 text-[clamp(16px,1.6vw,20px)] font-serif leading-tight">
                        {p.title}
                      </h3>
                    </div>
                    <div className="mt-4">
                      <Link to="/archivo" className="btn terra">
                        Ver en Archivo <Icon.Arrow />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA STRIP ============ */}
      <section className="section pt-10 pb-20">
        <div className="wrap">
          <Reveal className="cta-strip">
            <div>
              <h2 className="text-[clamp(28px,4vw,48px)]">
                Esta plataforma <em className="text-accent">permanece.</em>
              </h2>
              <p className="mt-3 text-fg-mute max-w-[56ch]">
                Un archivo público y vivo: lo que la cátedra ha investigado, conversado y publicado
                queda disponible para quien quiera leer, citar o continuarlo.
              </p>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Link to="/archivo" className="btn terra">
                Explorar el archivo <Icon.Arrow />
              </Link>
              <Link to="/historia" className="btn">
                Conocer la historia
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {openProj && (
          <motion.div
            className="modal-veil"
            onClick={() => setOpenProj(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
          >
            <motion.div
              className="modal"
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: prefersReduced ? 0 : 0.3, ease: 'easeOut' }}
            >
              <button className="close" onClick={() => setOpenProj(null)} aria-label="Cerrar"><Icon.Close /></button>
              <div className={'proj-thumb h-[220px] md:h-[280px] mb-6 md:mb-7 ' + (openProj.thumbnail ? '' : ' kind-' + openProj.kind)} style={{ backgroundImage: openProj.thumbnail ? 'url(' + openProj.thumbnail + ')' : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }} role="img" aria-label={openProj.title ? `Miniatura de ${openProj.title}` : 'Proyecto sin miniatura'}>
                <div className="kind-num">N° {openProj.n}</div>
                {!openProj.thumbnail && <div className="kind-glyph">{KIND_GLYPH_LOCAL[openProj.kind] || openProj.kind.toUpperCase()}</div>}
                {openProj.aiThumbnail && <div className="absolute top-2 left-2 z-10 font-mono text-[9px] tracking-[0.12em] uppercase bg-black/50 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded-sm">AI · ref.</div>}
              </div>
              <div className="kicker">{openProj.kind} · {openProj.year}</div>
              <h2 id="modal-title" className="mt-3 text-[clamp(26px,7vw,44px)] leading-tight">{openProj.title}</h2>
              <div className="text-fg-mute mt-2.5 text-base md:text-sm">{openProj.author}</div>

              {openProj.group && (
                <div className="mt-3 font-mono text-xs tracking-[0.12em] uppercase text-accent">{openProj.group}</div>
              )}

              <p className="mt-5 md:mt-6 text-fg-mute text-base leading-relaxed">
                {openProj.description
                  ? openProj.description
                  : 'Proyecto desarrollado en el marco del módulo final de la cátedra. La versión completa puede consultarse en los archivos de la Cátedra Caminos de Resistencia.'}
              </p>

              {openProj.members && openProj.members.length > 0 && (
                <div className="mt-5">
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute mb-2">Integrantes</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-mute">
                    {openProj.members.map((m, i) => (
                      <span key={i}>{m}{i < openProj.members!.length - 1 ? ' · ' : ''}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 mt-7 flex-wrap">
                {openProj.url ? (
                  <a href={openProj.url} target="_blank" rel="noopener noreferrer" className="btn terra">
                    {({ ensayo: 'Leer ensayo', cartografia: 'Explorar mapa', video: 'Ver video', podcast: 'Escuchar podcast', fanzine: 'Ver fanzine', mural: 'Ver mural', collage: 'Ver collage', grabado: 'Ver grabado' } as Record<string, string>)[openProj.kind] || 'Abrir documento'} <Icon.External />
                  </a>
                ) : (
                  <button className="btn" disabled>Próximamente</button>
                )}
                <Link to="/archivo" className="btn" onClick={() => setOpenProj(null)}>
                  Ver en Archivo <Icon.Arrow />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const KIND_GLYPH_LOCAL: Record<string, string> = {
  ensayo: 'Ensayo',
  cartografia: 'Cartografía',
  video: 'Video',
  podcast: 'Podcast',
  fanzine: 'Fanzine',
  mural: 'Mural',
  collage: 'Collage',
  grabado: 'Grabado',
};

const MISSION_POINTS = [
  { n: '01', title: 'Investigar', body: 'con rigor histórico el caso palestino desde las orillas del sur global, sin neutralidades cómplices ni eufemismos académicos.' },
  { n: '02', title: 'Documentar', body: 'la vida cotidiana bajo bloqueo: agua, semillas, hospitales, escuelas — la infraestructura de la firmeza (sumud).' },
  { n: '03', title: 'Sembrar',    body: 'redes entre universidades, ONGs, diásporas y comunidades campesinas que reconozcan parentescos de lucha.' },
  { n: '04', title: 'Publicar',   body: 'un archivo abierto — bibliografía, ensayos estudiantiles, cartografías, podcast — disponible más allá del aula.' },
];

const STATIONS = [
  { n: '01', title: 'La memoria como territorio', body: 'Cómo se construye el relato hegemónico de un despojo. Lectura cruzada de Sand, Masalha y Traverso: la invención del Estado, la ingeniería del traslado, el lugar de Gaza antes y después de la historia.' },
  { n: '02', title: 'Economía del bloqueo',       body: 'Agua, electricidad, combustible y harina como armas. Mapas operativos de los puntos de control, infraestructura humanitaria intervenida y la arquitectura del cerco.' },
  { n: '03', title: 'Sumud — la firmeza',         body: 'El cultivo del olivo como acto político. Casas demolidas y reconstruidas. Médicas y maestros que sostienen el oficio en hospitales destruidos. Resistencia que no se entiende sin cotidianidad.' },
  { n: '04', title: 'Solidaridades del sur',      body: 'Genealogía de los vínculos entre América Latina y Palestina: tercermundismo, no alineación, brigadas, exilios y diásporas. Cierre con una mesa de diálogo entre comunidades campesinas colombianas y delegaciones palestinas.' },
];

function OliveGlyph() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20 62 Q 38 16, 62 56" />
      <path d="M0,-7 C-3.5,-2, -3.5,2, 0,7 C3.5,2, 3.5,-2, 0,-7 Z" fill="currentColor" stroke="none"
            transform="translate(28,43) rotate(-32)" />
      <path d="M0,-7 C-3.5,-2, -3.5,2, 0,7 C3.5,2, 3.5,-2, 0,-7 Z" fill="currentColor" stroke="none"
            transform="translate(35,33) rotate(-15)" />
      <path d="M0,-6 C-3,-1.5, -3,1.5, 0,6 C3,1.5, 3,-1.5, 0,-6 Z" fill="currentColor" stroke="none"
            transform="translate(42,25) rotate(0)" />
      <path d="M0,-7 C-3.5,-2, -3.5,2, 0,7 C3.5,2, 3.5,-2, 0,-7 Z" fill="currentColor" stroke="none"
            transform="translate(50,34) rotate(22)" />
      <path d="M0,-7 C-3.5,-2, -3.5,2, 0,7 C3.5,2, 3.5,-2, 0,-7 Z" fill="currentColor" stroke="none"
            transform="translate(58,46) rotate(42)" />
      <ellipse cx="50" cy="48" rx="3" ry="4.5" transform="rotate(28 50 48)"
               fill="currentColor" stroke="none" />
      <line x1="20" y1="62" x2="62" y2="56" />
      <line x1="40" y1="62" x2="40" y2="74" />
    </svg>
  );
}

function KeyGlyph() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="24" cy="40" r="14" />
      <circle cx="24" cy="40" r="5" fill="currentColor" stroke="none" />
      <line x1="38" y1="40" x2="72" y2="40" />
      <line x1="60" y1="40" x2="60" y2="50" />
      <line x1="68" y1="40" x2="68" y2="48" />
    </svg>
  );
}

function SumudGlyph() {
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M14 64 L 26 22 L 40 48 L 54 18 L 66 64" />
      <line x1="10" y1="64" x2="70" y2="64" />
      <line x1="40" y1="64" x2="40" y2="74" />
    </svg>
  );
}

interface SimboCardProps {
  n: string;
  term: string;
  meaning: string;
  body: string;
  glyph: ReactNode;
  accent?: boolean;
}

function SimboCard({ n, term, meaning, body, glyph, accent }: SimboCardProps) {
  return (
    <Reveal as="article" className={'simbo-card card-base ' + (accent ? 'is-accent' : '')}>
      <div className="simbo-card-glyph" aria-hidden="true">{glyph}</div>
      <div className="simbo-card-n">/ {n}</div>
      <h3 className="simbo-card-term">{term}</h3>
      <div className="simbo-card-meaning">{meaning}</div>
      <p className="simbo-card-body">{body}</p>
    </Reveal>
  );
}

const BAR_COUNT = 24;
const WIGGLE_PATTERNS = ['w1', 'w2', 'w3', 'w4'];

function AudioPlayer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.3, once: true });
  const [activeTrackId, setActiveTrackId] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiReady, setApiReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [ytError, setYtError] = useState(false);

  const activeTrack = POETRY_PLAYLIST.find((t) => t.id === activeTrackId) ?? POETRY_PLAYLIST[0];
  const isYouTube = activeTrack.source === 'youtube';

  /* ============ YOUTUBE API (lazy) ============ */
  const loadYouTubeAPIRef = useRef<Promise<void> | null>(null);

  function loadYouTubeAPI(): Promise<void> {
    if (loadYouTubeAPIRef.current) return loadYouTubeAPIRef.current;
    if (window.YT?.Player) { setApiReady(true); return Promise.resolve(); }

    loadYouTubeAPIRef.current = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        setYtError(true);
        reject(new Error('YouTube API load timeout'));
      }, 10000);

      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        clearTimeout(timeout);
        if (typeof prev === 'function') prev();
        setApiReady(true);
        resolve();
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onerror = () => {
        clearTimeout(timeout);
        setYtError(true);
        reject(new Error('Failed to load YouTube API'));
      };
      document.head.appendChild(tag);
    }).catch(() => {});

    return loadYouTubeAPIRef.current;
  }

  useEffect(() => {
    if (!apiReady || !containerRef.current || playerRef.current) return;
    const firstYT = POETRY_PLAYLIST.find(t => t.source === 'youtube');
    if (!firstYT) return;
    const vid = firstYT.embedUrl.split('/').pop()!;
    try {
      playerRef.current = new window.YT!.Player(containerRef.current, {
        videoId: vid,
        playerVars: {
          autoplay: 0,
          mute: 1,
          enablejsapi: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (e) => {
            if (e.data === window.YT!.PlayerState.PLAYING) setIsPlaying(true);
            else if (
              e.data === window.YT!.PlayerState.PAUSED ||
              e.data === window.YT!.PlayerState.ENDED
            ) setIsPlaying(false);
          },
        },
      });
    } catch {
      setYtError(true);
    }
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [apiReady]);

  useEffect(() => {
    if (!playerRef.current || !playerReady || !isYouTube) return;
    try { (isPlaying ? playerRef.current.playVideo : playerRef.current.pauseVideo)(); } catch {}
  }, [isPlaying, playerReady, isYouTube]);

  useEffect(() => {
    if (!playerRef.current || !playerReady || !isYouTube) return;
    try { (isMuted ? playerRef.current.mute : playerRef.current.unMute)(); } catch {}
  }, [isMuted, playerReady, isYouTube]);

  useEffect(() => {
    if (!playerRef.current || !playerReady || !isYouTube) return;
    const id = activeTrack.embedUrl.split('/').pop()!;
    (isPlaying ? playerRef.current.loadVideoById(id) : playerRef.current.cueVideoById(id));
  }, [activeTrackId, playerReady, isYouTube]);

  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    if (!isYouTube) {
      try { playerRef.current.pauseVideo(); } catch {}
      setIsPlaying(false);
    }
  }, [activeTrackId, playerReady, isYouTube]);

  const barPatterns = useRef(
    Array.from({ length: BAR_COUNT }, (_, i) => WIGGLE_PATTERNS[i % WIGGLE_PATTERNS.length])
  );

  const barsActive = isPlaying && isInView && isYouTube;

  return (
    <div className="media-stub" ref={sectionRef}>
      {/* ======== HEAD ======== */}
      <div className="media-stub-head">
        <div className="md-dot" style={isYouTube && barsActive ? undefined : { animationPlayState: 'paused' }} />
        <div className="flex-1">
          <div className="md-now" role="status" aria-live="polite">
            {isYouTube
              ? (barsActive ? (isMuted ? 'Reproduciendo · silenciado' : 'Reproduciendo') : isPlaying ? 'Cargando' : 'Pausado')
              : 'Listo para reproducir'}
          </div>
          <div className="md-title" title={activeTrack.title}>{activeTrack.title}</div>
        </div>
        {isYouTube && (
          <div className="audio-controls flex items-center gap-1.5 flex-shrink-0 ml-auto">
            <button
              type="button"
              className={`audio-ctrl-btn ${isMuted ? 'is-muted' : ''}`}
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <Icon.VolumeX /> : <Icon.Volume />}
            </button>
            <button
              type="button"
              className="audio-ctrl-btn"
              onClick={() => {
                if (isYouTube && !apiReady) { loadYouTubeAPI(); }
                setIsPlaying((p) => !p);
              }}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Icon.Pause /> : <Icon.Play />}
            </button>
          </div>
        )}
      </div>

      {/* ======== FREQ BARS ======== */}
      {barsActive && (
        <div className="freq-bars" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <div
              key={i}
              className={`freq-bar ${barPatterns.current[i]} is-active`}
              style={{ animationDelay: `${(i * 0.06).toFixed(2)}s` }}
            />
          ))}
        </div>
      )}

      {/* ======== ACCORDION ======== */}
      <button
        type="button"
        className="audio-accordion-btn"
        onClick={() => {
          if (isYouTube && !showVideo && !apiReady) { loadYouTubeAPI(); }
          setShowVideo((v) => !v);
        }}
        aria-expanded={showVideo}
        aria-controls="audio-video-panel"
      >
        <span className="left-side">
          <div className="w-4 h-4 shrink-0 flex items-center" aria-hidden="true">
            <Icon.Music />
          </div>
          {isYouTube ? 'Ver interpretación visual' : activeTrack.source === 'spotify' ? 'Escuchar en Spotify' : 'Abrir reproductor'}
        </span>
        <span className={`chevron ${showVideo ? 'is-up' : ''}`}>
          <div className="w-4 h-4 shrink-0 flex items-center">
            <Icon.ChevronDown />
          </div>
        </span>
      </button>

      <div id="audio-video-panel" role="region" aria-label="Reproductor multimedia" className={`audio-video-wrapper ${showVideo ? 'is-open' : ''}`}>
        {isYouTube ? (
          <div className="aspect-video rounded-xl overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />
          </div>
        ) : activeTrack.source === 'spotify' ? (
          <div className="rounded-xl overflow-hidden" style={{ height: 352 }}>
            <iframe
              src={activeTrack.embedUrl}
              width="100%"
              height="100%"
              allow="encrypted-media; clipboard-write"
              className="border-0"
              title={activeTrack.title}
            />
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ height: 480 }}>
            <iframe
              src={activeTrack.embedUrl}
              width="100%"
              height="100%"
              allow="autoplay"
              className="border-0"
              title={activeTrack.title}
            />
          </div>
        )}
        {activeTrack.source !== 'youtube' && activeTrack.externalUrl && (
          <div className="mt-3 flex justify-center">
            <a
              href={activeTrack.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light"
            >
              Abrir en {activeTrack.source === 'spotify' ? 'Spotify' : 'Google Drive'}
              <span className="w-3.5 h-3.5 shrink-0 flex items-center">
                <Icon.External />
              </span>
            </a>
          </div>
        )}
      </div>

      {/* ======== YOUTUBE ERROR FALLBACK ======== */}
      {ytError && isYouTube && (
        <div className="mt-4 text-center py-4 px-4 border border-white/10 rounded-xl">
          <p className="text-sm opacity-80 mb-2">
            No se pudo cargar el reproductor de video.
          </p>
          {activeTrack.externalUrl && (
            <a
              href={activeTrack.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light"
            >
              Ver en YouTube <Icon.External />
            </a>
          )}
        </div>
      )}

      {/* ======== PLAYLIST ======== */}
      <ul className="md-list">
        {POETRY_PLAYLIST.map((track) => {
          const isActive = track.id === activeTrackId;
          return (
            <li
              key={track.id}
              className={isActive ? 'is-active' : ''}
              onClick={() => {
                setActiveTrackId(track.id);
                setShowVideo(false);
                if (track.source === 'youtube') setIsPlaying(true);
              }}
              aria-label={`${track.title} — ${track.author}${isActive ? ', reproduciendo' : ''}`}
            >
              <span className="md-kind">
                {isActive ? (
                  track.source === 'youtube' ? <Icon.Play /> : <Icon.External />
                ) : String(track.id).padStart(2, '0')}
              </span>
              <span className="md-name"><i>{track.title}</i></span>
              <span className="md-len">{track.author}</span>
            </li>
          );
        })}
      </ul>

      {/* ======== FOOTER ======== */}
      <div className="audio-player-footer">
        <p className="text-[10px] opacity-50 tracking-normal text-justify leading-normal block px-4 py-2">
          Aviso académico: Los recursos multimedia aquí enlazados provienen de plataformas públicas y se presentan con fines exclusivamente pedagógicos y de preservación de memoria. Las opiniones de las obras pertenecen a sus creadores y no representan a las instancias educativas o culturales que apoyan el desarrollo de este espacio.
        </p>
        <p className="text-[10px] md:text-[9.5px] leading-relaxed text-center w-full mb-3" style={{ color: 'var(--on-dark-legal)' }}>
          Las obras poéticas, sonoras y audiovisuales aquí incrustadas son propiedad intelectual de sus respectivos autores, intérpretes y productoras. Su exposición en esta plataforma se realiza bajo el amparo del derecho de cita y uso justo (fair use) con fines estrictamente educativos, de memoria e investigación académica, sin ánimo de lucro.
        </p>
        <span className="font-mono text-[11px] md:text-[10.5px] tracking-[0.15em]" style={{ color: 'var(--on-dark-legal)' }}>
          Curaduría · Cátedra Caminos de Resistencia
        </span>
        <button className="btn-ghost-light">
          Abrir antología completa
          <span className="w-3.5 h-3.5 shrink-0 flex items-center">
            <Icon.External />
          </span>
        </button>
      </div>
    </div>
  );
}
