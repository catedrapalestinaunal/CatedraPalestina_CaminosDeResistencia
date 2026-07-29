import type { ReactNode } from 'react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { ImageSlot } from '../components/ImageSlot';
import { Icon } from '../lib/icons';
import { LazyYouTube } from '../components/LazyYouTube';
import { OgMeta } from '../components/OgMeta';

import { SITE_URL, ogPageUrl } from '../lib/seo';
import { orgSchema, websiteSchema, courseSchema } from '../lib/seo-schema';
import { CONFIG } from '../lib/config';

const FeaturedProjects = lazy(() => import('../components/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));

import { EventsBanner } from '../components/EventsBanner';

export function Home() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    const el = projectsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowProjects(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <OgMeta
        title="Cátedra Caminos de Resistencia · UNAL"
        description="Cátedra Caminos de Resistencia · UNAL: plataforma de memoria y solidaridad académica Palestina Colombia. Espacio sentipensante de educación pública sobre Palestina desde Colombia. Repositorio de la Facultad de Derecho y Ciencias Políticas."
        url={SITE_URL}
        image={ogPageUrl('Cátedra Caminos de Resistencia', 'El Surco de la Memoria')}
      />
      <Helmet>
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
              <span className="num">26</span>
              <span className="lbl">Proyectos · realizados</span>
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

      {/* ============ EVENTS ============ */}
      <EventsBanner />

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
                  src="/images/home/ancient-olive-al-badawi-1200.webp"
                  srcSet="/images/home/ancient-olive-al-badawi-480.webp 480w, /images/home/ancient-olive-al-badawi-768.webp 768w, /images/home/ancient-olive-al-badawi-1200.webp 1200w"
                  avifSrcSet="/images/home/ancient-olive-al-badawi-480.avif 480w, /images/home/ancient-olive-al-badawi-768.avif 768w, /images/home/ancient-olive-al-badawi-1200.avif 1200w"
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
                <p className="mt-9 max-w-prose text-base md:text-[15px] leading-[1.7] md:leading-[1.65]" style={{ color: 'var(--on-dark-fg)' }}>
                  Si el ocupante toma la tierra, el poeta nombra la tierra. Si el archivo
                  quema, el cantor recuerda. Esta cátedra recoge un cuerpo poético, musical
                  y cinematográfico que ha sostenido la palabra <i>Palestina</i> durante
                  medio siglo de borradura sistemática.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="self-center">
              <div className="text-center space-y-2">
                <div className="font-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--gold-accent)' }}>
                  Interpretación musical · Marcel Khalifé
                </div>
                <LazyYouTube
                  embedId="UEeU-tx0SBU"
                  title="Rita (Rita y el fusil) — Mahmoud Darwish / Marcel Khalifé"
                />
                <div className="font-mono text-[11px] tracking-[0.04em] opacity-60 text-balance">
                  Rita (Rita y el fusil) · poema de Mahmoud Darwish musicado por Marcel Khalifé
                </div>
              </div>
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
      <section className="section pt-0 pb-20" ref={projectsRef}>
        <div className="wrap">
          <Reveal>
            <h2 className="hr-rule mb-10">
              <span>Cosecha {CONFIG.SEMESTRE} · proyectos destacados</span>
            </h2>
          </Reveal>

          {showProjects && (
            <Suspense fallback={
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
            }>
              <FeaturedProjects />
            </Suspense>
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

    </>
  );
}

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
      <div className="simbo-card-head">
        <div className="simbo-card-n">/ {n}</div>
        <h3 className="simbo-card-term">{term}</h3>
      </div>
      <div className="simbo-card-meaning">{meaning}</div>
      <p className="simbo-card-body">{body}</p>
    </Reveal>
  );
}


