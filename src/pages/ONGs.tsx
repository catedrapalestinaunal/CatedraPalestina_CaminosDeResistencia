import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/ongs.css';
import { Reveal } from '../components/Reveal';
import { ImageSlot } from '../components/ImageSlot';
import { ImageGallery } from '../components/ImageGallery';
import { ProjectModal } from '../components/ProjectModal';
import { ONG_CARDS, ONG_PARTNERS } from '../data/ongs';
import { useProjects } from '../lib/useProjects';
import { ExternalOrgs } from '../components/ExternalOrgs';
import type { ImageVariant, Project } from '../lib/types';
import { OG_IMAGE, SITE_URL, SITE_NAME, SITE_LOCALE } from '../lib/seo';
import { websiteSchema, breadcrumbSchema } from '../lib/seo-schema';

type Tab = 'vida' | 'partners' | 'field';

const TABS: { id: Tab; label: string }[] = [
  { id: 'vida',     label: 'Logística de la vida' },
  { id: 'partners', label: 'Aliadas' },
  { id: 'field',    label: 'Trabajo de campo' },
];

export function ONGs() {
  const [tab, setTab] = useState<Tab>('vida');
  const { projects } = useProjects();
  const [openProj, setOpenProj] = useState<Project | null>(null);

  const brigadaImages = [
    {
      src: '/images/ongs/olive-harvest-brigades-1.webp',
      alt: 'Voluntarios internacionales en campaña de recolección de aceitunas. Acompañamiento protector en terreno.',
      credit: 'Campaña de Solidaridad: Alternative Tourism Group (ATG Palestine). Reproducción con fines educativos y de memoria.'
    },
    {
      src: '/images/ongs/olive-harvest-brigades-2.webp',
      alt: 'Distribución y plantación de plantines de olivo para agricultores amenazados por confiscación de tierras.',
      credit: "Archivo documental: Campaña 'Olive Tree' (YMCA / JAI). Difusión bajo exención de fines académicos (Fair Use)."
    },
    {
      src: '/images/ongs/olive-harvest-brigades-3.webp',
      alt: 'Plantación comunitaria de olivos como medida de resistencia pacífica y protección del territorio.',
      credit: 'Registro: Holylands Arts / JAI Palestine (Plant an Olive Tree Campaign). Uso no comercial y pedagógico.'
    },
    {
      src: '/images/ongs/olive-harvest-brigades-4.webp',
      alt: 'Brigadistas internacionales colaborando con familias palestinas en la cosecha anual.',
      credit: 'Campaña de Solidaridad: Alternative Tourism Group (ATG Palestine). Reproducción con fines educativos y de memoria.'
    },
    {
      src: '/images/ongs/olive-harvest-brigades-5.webp',
      alt: 'Voluntarios protegiendo olivares amenazados por la expansión de infraestructuras de separación.',
      credit: 'Registro: Holylands Arts / JAI Palestine (Plant an Olive Tree Campaign). Uso no comercial y pedagógico.'
    }
  ];

  const joinOrganizations = [
    {
      name: "ISM (International Solidarity Movement)",
      description: "Movimiento liderado por palestinos. Coordina acompañamiento civil para disuadir ataques y documentar abusos. Requiere postulación previa y un compromiso mínimo de 2 semanas durante la cosecha.",
      link: "https://palsolidarity.org/join/"
    },
    {
      name: "JAI / YMCA & Alternative Tourism Group",
      description: "Organizan un programa anual de 10 días en otoño para brindar protección civil y apoyo logístico a las familias agricultoras palestinas que enfrentan restricciones de acceso a sus tierras.",
      link: "https://www.jai-pal.org/"
    },
    {
      name: "The Excellence Center in Palestine",
      description: "Centro basado en Hebrón que vincula a voluntarios internacionales con agricultores locales para proveer asistencia directa en la cosecha y generar inmersión cultural y de derechos humanos.",
      link: "https://excellencenter.org/"
    },
    {
      name: "Center for Jewish Nonviolence (CJNV)",
      description: "Coalición de activistas que organizan delegaciones anuales para acompañar a los agricultores en la cosecha, operando como escudo pacífico y red de documentación.",
      link: "https://cjnv.org/olive-harvest/"
    }
  ];

  return (
    <>
      <Helmet>
        <title>ONGs · Cátedra Caminos de Resistencia</title>
        <meta name="description" content="Savia y Sumud: ONG Palestina, ayuda humanitaria Gaza y organizaciones de derechos humanos. Logística de la vida, aliadas y trabajo de campo desde la Cátedra Caminos de Resistencia · UNAL Bogotá, Colombia." />
        <meta property="og:title" content="ONGs · Cátedra Caminos de Resistencia" />
        <meta property="og:description" content="Savia y Sumud: ONG Palestina, ayuda humanitaria Gaza y organizaciones de derechos humanos. Logística humanitaria, aliadas y brigadas de trabajo en Palestina · UNAL Bogotá." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/ongs`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={SITE_LOCALE} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ONGs · Cátedra Caminos de Resistencia" />
        <meta name="twitter:description" content="Savia y Sumud: ONG Palestina, ayuda humanitaria Gaza y organizaciones de derechos humanos. MAP, Al-Haq, PCRF, MSF · UNAL Bogotá." />
        <link rel="canonical" href={`${SITE_URL}/ongs`} />
        <script type="application/ld+json">
          {JSON.stringify([
            breadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'ONGs', url: '/ongs' },
            ]),
            websiteSchema(),
          ])}
        </script>
      </Helmet>
      <header className="page-head">
        <div className="wrap">
          <div className="row">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" /><span>Página 02 · ONGs</span></div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="mt-4">
                  Savia<br />
                  <em className="italic text-accent">y</em> Sumud
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="lede">
                <strong>La resistencia tiene logística.</strong> Esta página mapea
                organizaciones que sostienen el agua, el cuidado y la tierra cuando
                la infraestructura del Estado es —deliberadamente— inviable.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="subtabs">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={'subtab ' + (tab === t.id ? 'is-active' : '')}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </header>

      {tab === 'vida' && (
        <section className="section pt-6">
          <div className="wrap">
            <Reveal><h2 className="sr-only">Logística de la vida · organizaciones activas</h2></Reveal>
            <div className="cards">
              {ONG_CARDS.map((c, i) => (
                <Reveal as="article" key={i} delay={Math.min(i + 1, 3) * 0.08} className={'card group ' + c.size}>
                  {c.src ? (
                    <ImageSlot
                      height={c.imgHeight ?? 250}
                      label={c.label}
                      src={c.src}
                      alt={c.alt}
                      credit={c.credit}
                      variant={c.img as ImageVariant}
                      className="mb-5"
                      objectPosition={c.objectPosition}
                    />
                  ) : (
                    <div className={'card-img ' + (c.img === 'terra' ? 'terra' : '')}>{c.label}</div>
                  )}
                  <div className="tag">{c.tag}</div>
                  <h3>{c.title}</h3>
                  <p className="body">{c.body}</p>
                  <div className={'stat-strip ' + (c.blockade ? 'is-blockade' : '')}>
                    {c.blockade && <div className="label-row">Datos del Bloqueo</div>}
                    {c.stats.map((s, j) => (
                      <div key={j}>
                        <div className="v">{s.v}</div>
                        <div className="k">{s.k}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="hr-rule mb-6 mt-12">
                <span>Proyectos estudiantiles · salud y derechos humanos</span>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[4, 8, 20, 25].map((id, i) => {
                const p = projects.find(pr => pr.id === id);
                if (!p) return null;
                return (
                  <Reveal key={p.id} as="article" delay={i * 0.08}>
                    <div className="card" role="button" tabIndex={0} onClick={() => setOpenProj(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenProj(p); } }}>
                      <div className="kicker">{p.group || p.author}</div>
                      <div className="mt-1 font-mono text-[12px] sm:text-[10px] tracking-[0.1em] text-fg-mute">{({ ensayo: 'Ensayo', cartografia: 'Cartografía', video: 'Video', podcast: 'Podcast', fanzine: 'Fanzine', mural: 'Mural', collage: 'Collage', grabado: 'Grabado' } as Record<string, string>)[p.kind] || p.kind}</div>
                      <h3 className="mt-2 text-[clamp(16px,1.6vw,20px)] font-serif leading-tight">
                        {p.title}
                      </h3>
                      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <Link to="/archivo" className="btn terra w-full justify-center">
                          Ver en Archivo
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {tab === 'partners' && (
        <section className="section pt-6">
          <div className="wrap">
            <Reveal>
              <div className="hr-rule mb-6">
                <span>Listado vivo · 06 aliadas</span>
              </div>
            </Reveal>
            <div className="border-t border-[var(--line)]">
              {ONG_PARTNERS.map((p, i) => (
                <Reveal key={i}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-row no-underline text-inherit hover:text-inherit"
                  >
                    <div className="font-mono text-accent text-xs md:text-[11px] tracking-[0.15em]">0{i + 1}</div>
                    <div>
                      <div className="font-serif text-[20px] md:text-[26px] tracking-[-0.015em] leading-tight">{p.name}</div>
                    </div>
                    <div className="partner-city font-mono text-[12px] tracking-[0.14em] uppercase text-fg-mute">{p.city}</div>
                    <div className="partner-focus text-sm text-fg-mute">{p.focus}</div>
                    <div className="partner-since font-mono text-[12px] text-fg-mute tracking-[0.15em] text-right">est. {p.since}</div>
                  </a>
                </Reveal>
              ))}
            </div>

            <ExternalOrgs />
          </div>
        </section>
      )}

      {tab === 'field' && (
        <section className="section pt-6">
          <div className="wrap">
            <Reveal className="grid-2">
              <div>
                <h2 className="text-[clamp(32px,8vw,64px)] leading-tight">
                  Brigadas <em className="text-accent italic">de</em> cosecha
                </h2>
                <p className="text-fg-mute mt-4 text-base leading-relaxed max-w-full md:max-w-[48ch]">
                  Cada octubre, brigadas internacionales acompañan la cosecha de la aceituna en
                  Cisjordania. Acompañar no es producir — es estar ahí cuando se intenta arrancar el árbol.
                  La presencia es una unidad de medida política.
                </p>
                <div className="mt-7">
                  <button
                    className="btn terra"
                    onClick={() => {
                      document.getElementById('join-entities')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    Cómo unirse
                  </button>
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <ImageGallery hint="← Deslizar para ver galería →">
                  <div className="flex gap-4">
                    {brigadaImages.map((img, i) => (
                      <div key={i} className="min-w-[85%] md:min-w-[70%] snap-center shrink-0">
                        <ImageSlot height={360} src={img.src} alt={img.alt} credit={img.credit} label={`Brigada ${i + 1} · oct. 2025`} variant="olive" className="group" />
                      </div>
                    ))}
                  </div>
                </ImageGallery>
              </div>
            </Reveal>

            <div className="h-20" />

            <Reveal id="join-entities">
              <div className="hr-rule mb-6">
                <span>Entidades que gestionan el voluntariado</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {joinOrganizations.map((org, idx) => (
                  <Reveal as="article" key={idx} delay={idx * 0.08} className="p-6 bg-[var(--bg-warm)] border border-[var(--line)] rounded-[18px] hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-fg mb-2">{org.name}</h3>
                    <p className="text-sm text-fg-mute mb-4 leading-relaxed">{org.description}</p>
                    <a
                      href={org.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-accent hover:text-fg uppercase tracking-wider"
                    >
                      Sitio Oficial ↗
                    </a>
                  </Reveal>
                ))}
              </div>
            </Reveal>


          </div>
        </section>
      )}

      <ProjectModal project={openProj} onClose={() => setOpenProj(null)} />
    </>
  );
}
