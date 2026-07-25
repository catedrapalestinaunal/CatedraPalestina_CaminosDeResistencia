import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/archive.css';
import { ProjectModal } from '../components/ProjectModal';
import { Reveal } from '../components/Reveal';
import { Icon } from '../lib/icons';
import { useMediaQuery } from '../lib/hooks';
import { BIBLIOGRAPHY, KIND_GLYPH, buildKindFilters } from '../data/archive';
import { useProjects } from '../lib/useProjects';
import type { Project } from '../lib/types';
import { OG_IMAGE, SITE_URL, SITE_NAME, SITE_LOCALE } from '../lib/seo';
import { collectionPageSchema, bookSchema, breadcrumbSchema } from '../lib/seo-schema';

/* ============================================================
   Kind chip color map
   ============================================================ */
const KIND_CHIP_CLASS: Record<string, string> = {
  ensayo: 'kind-ensayo',
  cartografia: 'kind-cartografia',
  video: 'kind-video',
  podcast: 'kind-podcast',
  fanzine: 'kind-fanzine',
  mural: 'kind-mural',
  collage: 'kind-collage',
  grabado: 'kind-grabado',
};

interface ProjectCardProps {
  p: Project;
  onOpen: (p: Project) => void;
  variant: 'grid' | 'list';
}

function ProjectCard({ p, onOpen, variant }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    if (!p.thumbnail) { setImgError(false); return; }
    const img = new Image();
    img.onload = () => setImgError(false);
    img.onerror = () => setImgError(true);
    img.src = p.thumbnail;
  }, [p.thumbnail]);
  const hasThumb = p.thumbnail && !imgError;
  const thumbBg = hasThumb ? { backgroundImage: `url(${p.thumbnail})`, backgroundSize: 'cover' as const, backgroundPosition: 'center' as const } : undefined;
  if (variant === 'list') {
    return (
      <Reveal as="article" className="proj-row" onClick={() => onOpen(p)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(p); } }}>
        <div className={'proj-thumb' + (hasThumb ? '' : ' kind-' + p.kind)} style={thumbBg}>
          <div className="kind-num">N° {p.n}</div>
          {!hasThumb && <div className="kind-glyph">{KIND_GLYPH[p.kind]}</div>}
          {p.aiThumbnail && <div className="absolute top-1.5 left-1.5 z-10 font-mono text-[11px] md:text-[9px] tracking-[0.12em] uppercase bg-black/50 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded-sm">AI · ref.</div>}
        </div>
        <div className="proj-body">
          <h3>{p.title}</h3>
          <div className="proj-meta">{p.author} · {p.year} · <span className="text-accent">{p.kind.toUpperCase()}</span></div>
        </div>
        <span className={'proj-kind-chip ' + KIND_CHIP_CLASS[p.kind]}>{p.kind.toUpperCase()}</span>
        <span className="proj-arrow">→</span>
      </Reveal>
    );
  }
  return (
    <Reveal as="article" className="proj" onClick={() => onOpen(p)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(p); } }}>
      <div className={'proj-thumb' + (hasThumb ? '' : ' kind-' + p.kind)} style={thumbBg}>
        <div className="kind-num">N° {p.n}</div>
        {!hasThumb && <div className="kind-glyph">{KIND_GLYPH[p.kind]}</div>}
        {p.aiThumbnail && <div className="absolute top-1.5 left-1.5 z-10 font-mono text-[11px] md:text-[9px] tracking-[0.12em] uppercase bg-black/50 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded-sm">AI · ref.</div>}
      </div>
      <div className="meta">
        <span className="text-accent">{p.kind.toUpperCase()}</span>
        <span>· {p.year}</span>
      </div>
      <h3>{p.title}</h3>
      <div className="author">{p.author}</div>
      <div className="proj-foot">
        <span>{p.tags.join(' · ')}</span>
        <span className="text-accent">Abrir ↗</span>
      </div>
    </Reveal>
  );
}

export function Archive() {
  const [tab, setTab] = useState<'projects' | 'biblio'>('projects');
  const [kind, setKind] = useState<string>('all');
  const [semester, setSemester] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const isMobile = useMediaQuery('(max-width: 768px)');
  useEffect(() => { if (isMobile) setView('grid'); }, [isMobile]);
  const [query, setQuery] = useState('');
  const [openProj, setOpenProj] = useState<Project | null>(null);

  const { projects, loading, error, refetch } = useProjects();

  const kindFilters = useMemo(() => buildKindFilters(projects), [projects]);

  const semesters = useMemo(() => {
    const s = new Set(projects.map(p => p.year));
    return Array.from(s).sort().reverse();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p =>
      (kind === 'all' || p.kind === kind) &&
      (semester === 'all' || p.year === semester) &&
      (!query || (p.title + ' ' + p.author + ' ' + p.tags.join(' ')).toLowerCase().includes(query.toLowerCase()))
    );
  }, [kind, semester, query, projects]);

  return (
    <>
      <Helmet>
        <title>Archivo · Cátedra Caminos de Resistencia</title>
        <meta name="description" content="Cosecha de Saberes: bibliografía sobre Palestina, proyectos académicos Palestina y ensayos curados por la Cátedra Caminos de Resistencia. Proyectos estudiantiles desde la UNAL." />
        <meta property="og:title" content="Archivo · Cátedra Caminos de Resistencia" />
        <meta property="og:description" content="Cosecha de Saberes: bibliografía sobre Palestina, proyectos académicos Palestina y ensayos. Archivo vivo de la Cátedra Caminos de Resistencia UNAL." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/archivo`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={SITE_LOCALE} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Archivo · Cátedra Caminos de Resistencia" />
        <meta name="twitter:description" content="Cosecha de Saberes: bibliografía sobre Palestina y proyectos académicos Palestina. Archivo vivo de la Cátedra Caminos de Resistencia UNAL." />
        <link rel="canonical" href={`${SITE_URL}/archivo`} />
        <script type="application/ld+json">
          {JSON.stringify([
            breadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'Archivo', url: '/archivo' },
            ]),
            collectionPageSchema('Bibliografía sobre Palestina y proyectos académicos de la Cátedra Caminos de Resistencia.'),
            ...BIBLIOGRAPHY.map(b => bookSchema(b.author, b.work, b.year)),
          ])}
        </script>
      </Helmet>
      <header className="page-head">
        <div className="wrap">
          <div className="row">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" /><span>Página 04 · Archivo</span></div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="mt-4">
                  Cosecha<br />
                  <em className="italic text-accent">de</em> saberes
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="lede">
                Ensayos, cartografías, murales, fanzines, grabados, capítulos sonoros y videos
                producidos por estudiantes de la cátedra. Más una biblioteca curada que nombra de dónde venimos.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25}>
            <div className="mt-6 flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]" />
              <p className="font-mono text-[12px] md:text-[10.5px] tracking-[0.06em] text-fg-mute leading-relaxed">
                Algunas miniaturas fueron generadas con inteligencia artificial como recurso pedagógico y pueden contener imprecisiones históricas o geográficas. Esta página es producto de una actividad académica.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="subtabs">
              <button className={'subtab ' + (tab === 'projects' ? 'is-active' : '')} onClick={() => setTab('projects')}>
                Proyectos · {projects.length}
              </button>
              <button className={'subtab ' + (tab === 'biblio' ? 'is-active' : '')} onClick={() => setTab('biblio')}>
                Bibliografía · {BIBLIOGRAPHY.length}
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {tab === 'projects' && (
        <section className="section pt-0">
          <div className="wrap">
            <h2 className="sr-only">Proyectos académicos</h2>

            {loading ? (
              <div className="archive-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="proj animate-pulse">
                    <div className="proj-thumb bg-fg-mute/10" />
                    <div className="mt-3 h-2.5 bg-fg-mute/10 rounded w-1/4" />
                    <div className="mt-2.5 h-4 bg-fg-mute/10 rounded w-3/4" />
                    <div className="mt-2 h-3 bg-fg-mute/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-16 md:py-20 text-center text-fg-mute px-4">
                <div className="font-serif text-3xl md:text-4xl">Error al cargar.</div>
                <div className="mt-2.5 text-base md:text-sm">No se pudieron obtener los proyectos. Verifica tu conexión e intenta de nuevo.</div>
                <button className="btn terra mt-6" onClick={refetch}>Reintentar</button>
              </div>
            ) : (
              <>
                <Reveal className="archive-toolbar flex-col items-stretch gap-[22px]">
                  <div className="archive-search is-prominent">
                    <Icon.Search />
                    <input
                      placeholder="Buscar en el archivo · autora, título, etiqueta, año…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <button className="icon-btn w-8 h-8 md:w-11 md:h-11" onClick={() => setQuery('')} aria-label="Limpiar búsqueda">
                        <Icon.Close />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="chips">
                      <button
                        className={'chip ' + (semester === 'all' ? 'is-on' : '')}
                        onClick={() => setSemester('all')}
                      >
                        Todos
                      </button>
                      {semesters.map(s => (
                        <button
                          key={s}
                          className={'chip ' + (semester === s ? 'is-on' : '')}
                          onClick={() => setSemester(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="chips">
                      {kindFilters.map(k => (
                        <button
                          key={k.id}
                          className={'chip ' + (kind === k.id ? 'is-on' : '')}
                          onClick={() => setKind(k.id)}
                        >
                          {k.label} · {k.n}
                        </button>
                      ))}
                    </div>
                    <div className="ml-auto flex gap-3 items-center">
                      <span className="font-mono text-xs md:text-[11px] tracking-[0.14em] uppercase text-fg-mute">
                        {filtered.length} de {projects.length}
                      </span>
                      <div className="viewtoggle">
                        <button className={view === 'grid' ? 'is-on' : ''} onClick={() => setView('grid')}><Icon.Grid /></button>
                        <button className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')}><Icon.Rows /></button>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {filtered.length === 0 ? (
                  <div className="py-16 md:py-20 text-center text-fg-mute px-4">
                    <div className="font-serif text-3xl md:text-4xl">Sin coincidencias.</div>
                    <div className="mt-2.5 text-base md:text-sm">Prueba otra etiqueta o vacía la búsqueda.</div>
                  </div>
                ) : (
                  <div className={view === 'grid' ? 'archive-grid' : ''}>
                    {filtered.map(p => (
                      <ProjectCard key={p.id} p={p} onOpen={setOpenProj} variant={view} />
                    ))}
                  </div>
                )}

                <Reveal>
                  <div className="mt-10 text-center">
                    <Link to="/genero" className="btn terra">
                      Proyectos con enfoque de género <Icon.Arrow />
                    </Link>
                  </div>
                </Reveal>
              </>
            )}
          </div>
        </section>
      )}

      {tab === 'biblio' && (
        <section className="section pt-0">
          <div className="wrap">
            <Reveal>
              <h2 className="hr-rule mb-5">
                <span>Bibliografía base · curada por el equipo docente</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="biblio">
                {BIBLIOGRAPHY.map((b, i) => (
                  <div key={i} className="biblio-item">
                    <div className="idx">N° {String(i + 1).padStart(2, '0')}</div>
                    <div className="flex gap-3 items-start">
                      <span className="biblio-icon" aria-hidden="true"><Icon.Book /></span>
                      <div>
                        <div className="biblio-author">{b.author}</div>
                        <div className="work">{b.work}</div>
                      </div>
                    </div>
                    <div className="meta-r">{b.origin} · {b.year}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 text-center">
                <Link to="/voces" className="btn">
                  Autores recomendados en cultura y medios <Icon.Arrow />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <ProjectModal project={openProj} onClose={() => setOpenProj(null)} hideArchiveLink />
    </>
  );
}
