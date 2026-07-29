import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/voces.css';
import { Reveal } from '../components/Reveal';
import { ImageSlot } from '../components/ImageSlot';
import { ImageGallery } from '../components/ImageGallery';
import { ProjectModal } from '../components/ProjectModal';
import { Icon } from '../lib/icons';
import { PODCAST_SERIES } from '../data/podcast-series';
import { useProjects } from '../lib/useProjects';
import { SITE_URL, OG_IMAGE } from '../lib/seo';
import { OgMeta } from '../components/OgMeta';
import { articleSchema, breadcrumbSchema, videoObjectSchema, podcastEpisodeSchema } from '../lib/seo-schema';
import { LazyYouTube } from '../components/LazyYouTube';
import { CONFIG } from '../lib/config';
import type { Project } from '../lib/types';

/* ============================================================
   Darwish interactive poem card
   ============================================================ */
function DarwishCard() {
  const [active, setActive] = useState(0);

  const poems = [
    {
      title: 'Carné de identidad',
      year: '1964',
      lines: [
        'Registra:', 'Soy árabe.',
        'Mi número de carné es cincuenta mil.',
        'Tengo ocho hijos',
        'y el noveno vendrá después del verano.',
        '¿Te enfadas?',
      ],
    },
    {
      title: 'En esta tierra',
      year: '1992',
      lines: [
        'En esta tierra hay lo que merece la vida:',
        'fines de abril,',
        'el olor del pan al amanecer,',
        'una mujer que empieza el día con gimnasia...',
        'La vida no es sino esta tierra.',
      ],
    },
    {
      title: 'El pasajero',
      year: '1999',
      lines: [
        'Soy el pasajero de paso en palabras.',
        'El viento habita en mis palabras.',
        'Vine de allá. Vuelvo allá.',
        'No hay donde ir sino hacia el origen.',
      ],
    },
  ];

  const p = poems[active];

  return (
    <div className="media-stub">
      <div className="media-stub-head">
        <div className="md-dot" />
        <div className="flex-1">
          <div className="md-now">Antología poética · Mahmoud Darwish</div>
          <div className="md-title"><i>{p.title}</i></div>
        </div>
         <div className="font-mono text-[11px] text-[var(--on-dark-legal)] tracking-[.1em]">
          {p.year}
        </div>
      </div>

      <div className="darwish-verse">
        {p.lines.map((line, i) => <span key={i}>{line}<br /></span>)}
      </div>

      <ul className="md-list mt-[18px]">
        {poems.map((q, i) => (
          <li key={i} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }}>
            <span className="md-kind">{i === active ? <Icon.Play /> : 'Verso'}</span>
            <span className="md-name"><i>{q.title}</i></span>
            <span className="md-len">{q.year}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   TAB 1 — Arte y Cultura
   ============================================================ */
function ArteTab({ onOpenProj }: { onOpenProj: (p: Project) => void }) {
  const { projects } = useProjects();
  const muralImages = [
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Bethlehem-02-West_Bank_Wall.jpg',
      alt: 'Muralismo a gran escala sobre los bloques de hormigón del muro de separación en Belén.',
      credit: 'Fotografía por Ian and Wendy Sewell (CC BY-SA 3.0). Vía Wikimedia Commons.',
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Handala.jpg',
      alt: 'Grafiti del icónico personaje Handala de Naji al-Ali pintado sobre la infraestructura del muro.',
      credit: 'Registro urbano por シャター (CC BY-SA 4.0). Vía Wikimedia Commons.',
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Graffiti_on_the_Bethlehem_wall_05.jpg',
      alt: 'Perspectiva de expresiones artísticas y mensajes de protesta en el muro de Belén.',
      credit: 'Fotografía por Davide Mauro (CC BY-SA 4.0). Vía Wikimedia Commons.',
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Bethlehem_Wall_Graffiti_-_Ich_bin_ein_Berliner.jpg',
      alt: 'Intervención de arte callejero de carácter político internacional sobre el concreto.',
      credit: 'Fotografía por Marc Venezia (CC BY-SA 3.0). Vía Wikimedia Commons.',
    },
  ];

  return (
    <>
    <section className="section">
      <div className="wrap">

        <Reveal>
          <div className="voces-open-quote">
            <h2 className="eyebrow"><span className="dot" />Apertura · Arte y resistencia</h2>
            <blockquote className="voces-bq">
              "La fórmula de la indignación siempre debe acompañarse
              con los{' '}
              <em className="text-accent">susurros de la poesía</em>"
            </blockquote>
            <cite className="voces-bq-attr">
              — De Vietnam a Palestina · Herencia anticolonial
            </cite>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="voces-darwish-band">
            <div className="voces-darwish-inner">
              <div>
                <div className="eyebrow text-[var(--on-dark-mute)]">
                  <span className="dot bg-[var(--gold-accent)]" />
                  Poesía · Voz central
                </div>
                <h3 className="voces-darwish-name">
                  Mahmoud<br />Darwish
                </h3>
                <p className="voces-darwish-bio">
                  1941–2008. Poeta palestino considerado la voz más importante de la
                  resistencia literaria árabe. Sus palabras sostuvieron la identidad
                  de un pueblo mientras los mapas la negaban.
                </p>
                <div className="voces-darwish-works">
                  Carné de identidad · 1964<br />
                  Memoria para el olvido · 1982<br />
                  El lecho de una extranjera · 1999
                </div>
              </div>
              <div>
                <DarwishCard />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="voces-masonry">
          <Reveal>
            <div className="card card-base p-0 overflow-hidden">
              <div className="relative w-full">
                <ImageGallery hint="← Deslizar murales →">
                  <div className="flex gap-4">
                    {muralImages.map((img, index) => (
                      <div key={index} className="min-w-[90%] shrink-0 snap-center md:min-w-[80%]">
                        <ImageSlot
                          alt={img.alt}
                          className="group"
                          credit={img.credit}
                          height={210}
                          label={`Mural · Belén · ${index + 1}/${muralImages.length}`}
                          src={img.src}
                          variant="olive"
                        />
                      </div>
                    ))}
                  </div>
                </ImageGallery>
              </div>
              <div className="voces-card-pad">
                <div className="kicker">Murales · Arte Urbano</div>
                <h3 className="voces-card-title">La pared como cuaderno</h3>
                <p className="voces-card-body">
                  Desde Beirut hasta Ramallah, el mural es el archivo popular
                  que no necesita permiso ni editor. Una pared basta para que
                  la memoria persista donde el Estado quiere borradura.
                </p>
                <Link to="/historia" className="btn terra mt-3">
                  Contexto histórico del muro <Icon.Arrow />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card">
              <div className="kicker">Cine · Documental</div>
              <h3 className="voces-card-title">1948 · Muhammad Bakri</h3>
              <ImageSlot
                alt="Póster oficial del documental '1948' del director Mohammad Bakri. Registro y preservación de la memoria oral palestina."
                credit="Material promocional y de archivo indexado en IMDb (1998). Exhibición digital con fines estrictamente académicos, pedagógicos y de crítica cinematográfica bajo el amparo del Derecho de Cita (Fair Use)."
                label="Documental 1948 · Muhammad Bakri"
                src="/images/voces/documental-1948-bakri.webp"
                variant="terra"
              />
              <p className="voces-card-body">
                Una de las primeras miradas cinematográficas a la Nakba desde adentro.
                Bakri construye un contra-archivo audiovisual ante el silencio oficial,
                recuperando testimonios directos del desplazamiento.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="card">
              <div className="kicker">Pedagogía · Lúdica</div>
              <h3 className="voces-card-title">El juego como acto político</h3>
              <p className="voces-card-body">
                Bajo bloqueo, el juego no es frivolidad: es el ejercicio del derecho
                a la infancia. La lúdica afirma la humanidad frente al intento
                sistemático de deshumanización.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="voces-float-quote">
              <p className="voces-float-verse">
                "Escribo el nombre de mi tierra en el viento,
                pero el viento no sabe que mi tierra tiene nombre."
              </p>
              <cite className="voces-float-attr">— Mahmoud Darwish</cite>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="card">
              <div className="kicker">Tatreez · Bordado Tradicional</div>
              <h3 className="voces-card-title">Memoria cosida a mano</h3>
              <p className="voces-card-body">
                El tatreez —bordado palestino de más de tres mil años— es un sistema
                simbólico que identifica la región de origen de cada familia.
                Cada patrón es un apellido que el exilio no puede borrar.
              </p>
              <div className="voces-unesco-badge">
                UNESCO · Patrimonio Cultural Inmaterial · 2021
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="hr-rule mb-6">
            <span>Proyectos estudiantiles · arte y cultura</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 4, 5, 19, 20, 24, 15, 22, 23, 17].map((id, i) => {
            const p = projects.find(pr => pr.id === id);
            if (!p) return null;
            return (
              <Reveal key={p.id} as="article" delay={i * 0.08}>
                <div className="card" role="button" tabIndex={0} onClick={() => onOpenProj(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenProj(p); } }}>
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
    </>
  );
}

/* ============================================================
   PeriodismoTab
   ============================================================ */
function PeriodismoTab({ onOpenProj }: { onOpenProj: (p: Project) => void }) {
  const { projects } = useProjects();
  return (
    <>
    <section className="section">
      <div className="wrap">

        <Reveal>
          <div className="voces-traverso-band">
            <h2 className="eyebrow">
              <span className="dot bg-[var(--gold-accent)]" />
              Periodismo · Encuadre editorial
            </h2>
            <blockquote className="pull-quote mt-[22px]">
              "El universalismo ha sido siempre{' '}
              <span className="text-[var(--gold-accent)]">Occidente extendiendo sus valores</span>
              {' '}como si fueran universales."
            </blockquote>
            <cite className="quote-attrib mt-[22px] block">
              — Enzo Traverso
            </cite>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="voces-editorial">
            <div className="voces-editorial-lead">
              <span className="voces-drop-cap">E</span>
              <p className="text-[17px] leading-[1.78] text-fg">
                l relato hegemónico sobre el conflicto palestino ha sido construido con herramientas
                precisas: la <strong>dicotomía civilización vs. barbarie</strong>, el lenguaje de
                "guerra" donde hay ocupación, la equivalencia falsa entre colonizador y colonizado.
                Este encuadre no es accidental —es una tecnología política.
              </p>
            </div>
            <div className="voces-editorial-cols">
              <div>
                <h3 className="voces-editorial-h4">
                  La dicotomía civilización&thinsp;/&thinsp;barbarie
                </h3>
                <p className="voces-editorial-p">
                  Desde Fanon hasta Traverso, el pensamiento anticolonial ha identificado
                  esta dicotomía como el mecanismo central de justificación del despojo.
                  El "civilizado" tiene derecho a todo; el "bárbaro" carece de derechos
                  que respetar.
                </p>
                <p className="voces-editorial-p mt-4">
                  En el caso palestino, el encuadre opera con precisión técnica: los medios
                  dominantes hablan de "operaciones quirúrgicas" para los bombardeos
                  y "terrorismo" para cualquier forma de resistencia.
                </p>
              </div>
              <div>
                <h3 className="voces-editorial-h4">
                  El fraude Joan Peters
                </h3>
                <p className="voces-editorial-p">
                  El libro <em>From Time Immemorial</em> (1984) argumentaba que Palestina
                  estaba "vacía" antes de la inmigración judía. Celebrado ampliamente
                  en Occidente —hasta que Finkelstein y otros historiadores demostraron
                  que era una fabricación sistemática de fuentes y estadísticas.
                </p>
                <p className="voces-editorial-p mt-4">
                  Los desmentidos nunca alcanzaron la difusión de las mentiras originales.
                  Así funciona el sesgo mediático estructural.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="voces-dark-block">
            <div className="voces-db-inner">
              <div className="font-mono text-[11px] tracking-[.2em] uppercase text-accent">
                Concepto · Memoria en disputa
              </div>
              <h3 className="voces-dark-heading">
                Memoridicio
              </h3>
              <p className="voces-dark-p mt-[26px]">
                El <strong className="text-white">memoridicio</strong> nombra el proceso sistemático de
                borrado de la memoria histórica de un pueblo: destrucción de archivos,
                renombramiento de ciudades, negación de la cultura y la lengua,
                eliminación de documentos civiles.
              </p>
              <p className="voces-dark-p mt-4">
                En el caso palestino opera en múltiples registros simultáneos:
                demolición de cementerios, prohibición de la enseñanza del árabe,
                exclusión sistemática de las narrativas palestinas en los currículos
                educativos occidentales.
              </p>
              <div className="voces-db-stats">
                {[
                  { v: '+500', k: 'Aldeas borradas · desde 1948' },
                  { v: '418',  k: 'Topónimos árabes · renombrados' },
                  { v: '15k+', k: 'Documentos destruidos' },
                ].map(s => (
                  <div key={s.k}>
                    <div className="voces-dark-stat-value">{s.v}</div>
                     <div className="voces-dark-stat-label">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="voces-db-footer">
               <div className="voces-dark-footer-label">
                Contra el memoridicio
              </div>
              <div className="voces-dark-footer-quote">
                La historia oral —testimonios grabados, memorias transcritas, relatos
                transmitidos de generación en generación— es el contra-archivo que el
                poder no puede destruir porque vive en cuerpos, no en edificios.
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>

    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="hr-rule mb-6">
            <span>Proyectos estudiantiles · periodismo y narrativas</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[16].map((id, i) => {
            const p = projects.find(pr => pr.id === id);
            if (!p) return null;
            return (
              <Reveal key={p.id} as="article" delay={i * 0.08}>
                <div className="card" role="button" tabIndex={0} onClick={() => onOpenProj(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenProj(p); } }}>
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
    </>
  );
}

/* ============================================================
   SolidaridadTab
   ============================================================ */
function SolidaridadTab() {
  return (
    <section className="section">
      <div className="wrap">

        <Reveal>
          <div className="voces-tutu">
            <h2 className="eyebrow text-[rgba(241,237,224,.65)]">
              <span className="dot bg-[var(--gold-accent)]" />
              Apertura · Neutralidad imposible
            </h2>
            <blockquote className="voces-tutu-verse">
              "Si eliges ser neutral en situaciones de injusticia,
              <em> has elegido el lado del opresor.</em>"
            </blockquote>
            <cite className="voces-tutu-attr">
              — Desmond Tutu · Arzobispo · Premio Nobel de la Paz 1984
            </cite>
          </div>
        </Reveal>

        <div className="grid-2">

          <Reveal>
            <div className="card">
              <div className="kicker">Sur Global · Genealogías compartidas</div>
              <h3 className="voces-card-lg-h3">
                Parentescos de lucha
              </h3>
              <p className="voces-card-lg-p">
                La causa palestina es el nodo más visible de una red de resistencias
                coloniales en el Sur Global. La solidaridad tercermundista, el movimiento
                de no-alineados y las brigadas internacionales construyeron vínculos
                orgánicos entre Palestina, Cuba, Vietnam y Colombia.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {['Tercermundismo', 'No-Alineados', 'Brigadas', 'Diáspora'].map(tag => (
                  <span key={tag} className="px-3 py-[6px] rounded-full border border-primary font-mono text-[10.5px] tracking-[.12em] uppercase text-primary">{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card">
              <div className="kicker">Judaísmo Antisionista</div>
              <h3 className="voces-card-lg-h3">
                Jewish Voice for Peace
              </h3>
              <p className="voces-card-lg-p">
                Sionismo y judaísmo no son sinónimos. Jewish Voice for Peace y otros
                movimientos antisionistas recuerdan que la crítica al Estado de Israel
                no es antisemitismo —es una posición ética enraizada en tradiciones
                propias de justicia.
              </p>
              <div className="mt-[18px] p-[14px_16px] bg-[var(--olive-soft)] rounded-[10px] font-mono text-[11px] text-primary tracking-[.12em] uppercase">
                "Not in our name" · Coalición antisionista judía
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card">
              <div className="kicker">Universidad Nacional · Colombia</div>
              <h3 className="voces-card-lg-h3">
                La cátedra como acto político
              </h3>
              <p className="voces-card-lg-p">
                La Universidad Nacional de Colombia abrió este espacio porque entiende
                que la neutralidad académica frente al genocidio es complicidad
                disfrazada de objetividad. Investigar es ya tomar posición.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="card">
              <div className="kicker">Red de solidaridad · datos</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { v: '+78',  k: 'Años de despojo' },
                  { v: '26',   k: 'Proyectos estudiantiles' },
                  { v: '2024', k: 'Año del fallo CIJ' },
                  { v: '19',   k: 'Años de bloqueo' },
                ].map(s => (
                  <div key={s.k} className="pt-3 border-t border-[var(--line-soft)]">
                    <div className="voces-stat-value">{s.v}</div>
                    <div className="voces-stat-label">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>

        <Reveal>
          <div className="voces-cij">
            <div className="voces-cij-header">
              <div className="voces-cij-mono">
                Corte Internacional de Justicia · La Haya · 2024
              </div>
              <h3 className="voces-cij-h3">
                Fallo histórico sobre la ilegalidad de la ocupación
              </h3>
            </div>
            <div className="voces-cij-body">
              <div className="voces-cij-col">
                <div className="voces-cij-col-label">Caso</div>
                <p className="voces-cij-col-p">
                  Opinión Consultiva solicitada por la Asamblea General de la ONU sobre
                  las consecuencias jurídicas de las políticas y prácticas de Israel
                  en el Territorio Palestino Ocupado, incluida Jerusalén Oriental.
                </p>
              </div>
              <div className="voces-cij-col">
                <div className="voces-cij-col-label">Resolución</div>
                <p className="voces-cij-col-p">
                  La CIJ determinó que la presencia continuada de Israel en el
                  Territorio Palestino Ocupado es{' '}
                  <strong className="voces-cij-strong">ilegal bajo el derecho
                  internacional</strong>, y que Israel debe poner fin a su ocupación
                  sin condiciones ni demora.
                </p>
              </div>
              <div className="voces-cij-col">
                <div className="voces-cij-col-label">Implicaciones</div>
                <p className="voces-cij-col-p">
                  Todos los Estados tienen la obligación de no reconocer como legal
                  la situación resultante y de no prestar ayuda ni asistencia al
                  mantenimiento de dicha presencia ilegal.
                </p>
              </div>
            </div>
            <div className="voces-cij-footer">
              <span className="voces-cij-mono">19 · VII · 2024 · Opinión Consultiva</span>
              <span className="voces-cij-mono opacity-55">Res. A/ES-10/L.31/Rev.1</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 text-center">
            <Link to="/historia" className="btn">
              Línea histórica del conflicto <Icon.Arrow />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

/* ============================================================
   Main Voces page
   ============================================================ */
export function Voces() {
  const [tab, setTab] = useState<'arte' | 'periodismo' | 'solidaridad' | 'podcast' | 'videos'>('arte');
  const { projects } = useProjects();
  const [openProj, setOpenProj] = useState<Project | null>(null);

  const videos = projects.filter(p => p.kind === 'video');
  const podcasts = projects.filter(p => p.kind === 'podcast');

  const tabs: { id: 'arte' | 'periodismo' | 'solidaridad' | 'podcast' | 'videos'; label: string }[] = [
    { id: 'arte',        label: 'Arte y Cultura' },
    { id: 'periodismo',  label: 'Periodismo y Narrativas' },
    { id: 'solidaridad', label: 'Solidaridad y Sur Global' },
    { id: 'podcast',     label: 'Podcast · Producción estudiantil' },
    { id: 'videos',      label: 'Video · Producción estudiantil' },
  ];

  return (
    <>
      <OgMeta
        title="Voces · Cátedra Caminos de Resistencia"
        description="Voces de la Resistencia: Mahmoud Darwish poemas, arte mural palestino, Handala de Naji al-Ali, muro de Belén grafiti, periodismo en Gaza y fallo CIJ Palestina 2024. Memoria viva desde la Cátedra Caminos de Resistencia."
        url={`${SITE_URL}/voces`}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify([
            breadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'Voces', url: '/voces' },
            ]),
            articleSchema(
              'Voces de la Resistencia · Cultura, periodismo y solidaridad',
              'Mahmoud Darwish poemas, arte mural palestino, Handala, periodismo en Gaza y fallo CIJ Palestina 2024.'
            ),
            ...(tab === 'videos' ? videos.map(v =>
              videoObjectSchema(
                v.title,
                v.description || '',
                v.thumbnail || OG_IMAGE,
                v.url || '',
                v.year,
              )
            ) : []),
            ...(tab === 'podcast' ? podcasts.map((p, i) =>
              podcastEpisodeSchema(
                p.title,
                p.description || '',
                p.url || '',
                i + 1,
              )
            ) : []),
          ])}
        </script>
      </Helmet>
      <header className="page-head">
        <div className="wrap">
          <div className="row">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" />Página 05 · Voces</div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-[18px]">
                  Voces<br />
                  <em className="italic text-accent">de la</em><br />
                  Resistencia
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <p className="lede">
                <strong>Arte, periodismo, solidaridad, podcast y video</strong> como formas de
                resistencia al borramiento. Cinco miradas que sostienen la memoria
                viva cuando los archivos callan.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.24}>
            <div className="subtabs">
              {tabs.map(t => (
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

      {tab === 'arte'        && <ArteTab onOpenProj={setOpenProj} />}
      {tab === 'periodismo'  && <PeriodismoTab onOpenProj={setOpenProj} />}
      {tab === 'solidaridad' && <SolidaridadTab />}
      {tab === 'podcast'     && <PodcastTab onOpenProj={setOpenProj} />}
      {tab === 'videos'      && <VideoTab />}

      <ProjectModal project={openProj} onClose={() => setOpenProj(null)} />
    </>
  );
}

function getYouTubeEmbedId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getSpotifyEmbedUrl(url: string): string | null {
  if (!url.includes('open.spotify.com/')) return null;
  return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
}

/* ============================================================
   TAB 5 — Video · Producción estudiantil
   ============================================================ */
function VideoTab() {
  const { projects } = useProjects();
  const [active, setActive] = useState(0);
  const videos = projects.filter(p => p.kind === 'video').sort((a, b) => a.id - b.id);
  const v = videos[active];

  if (!v) return null;

  const embedId = v.url ? getYouTubeEmbedId(v.url) : null;

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="voces-open-quote">
            <h2 className="eyebrow"><span className="dot" />Video · Producción estudiantil</h2>
            <blockquote className="voces-bq">
              &ldquo;Proyectos de video · Grupos {CONFIG.SEMESTRE}&rdquo;
            </blockquote>
            <cite className="voces-bq-attr">
              — Grupos 1, 2, 17, 21, 23
            </cite>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="hr-rule mb-6">
            <span>Capítulos</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {videos.map((vid, i) => (
              <button
                key={vid.id}
                className={'chip ' + (active === i ? 'is-on' : '')}
                onClick={() => setActive(i)}
              >
                Cap. {i + 1} · {vid.group || vid.author}
              </button>
            ))}
          </div>
        </Reveal>

        <div
          key={active}
          style={{ animation: 'fadeSlideIn 0.35s ease-out' }}
        >
          <Reveal>
            <div className="card">
              <div className="kicker">{v.group || v.author} · {v.kind}</div>
              <h3 className="mt-2 text-[clamp(22px,3vw,34px)] font-serif leading-tight">
                {v.title}
              </h3>
              {v.description && (
                <p className="mt-3 text-fg-mute text-base leading-relaxed">
                  {v.description}
                </p>
              )}

              {embedId && (
                <div className="mt-5">
                  <LazyYouTube embedId={embedId} title={v.title} />
                </div>
              )}

              {v.members && v.members.length > 0 && (
                <details className="mt-6 pt-5 border-t border-[var(--line)]">
                  <summary className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute cursor-pointer">
                    Integrantes · {v.members.length}
                  </summary>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-fg-mute">
                    {v.members.map((m, i) => (
                      <span key={i}>{m}{i < v.members!.length - 1 ? '·' : ''}</span>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TAB 4 — Podcast · Producción estudiantil
   ============================================================ */
function PodcastTab({ onOpenProj }: { onOpenProj: (p: Project) => void }) {
  const { projects } = useProjects();
  const podcasts = projects.filter(p => p.kind === 'podcast');

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <div className="voces-open-quote">
            <h2 className="eyebrow"><span className="dot" />Podcast · Producción estudiantil</h2>
            <blockquote className="voces-bq">
              &ldquo;Proyectos de podcast · Grupos {CONFIG.SEMESTRE}&rdquo;
            </blockquote>
            <cite className="voces-bq-attr">
              — Grupos 7, 8, 13, 18, 25, 26
            </cite>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="hr-rule mb-8">
            <span>{podcasts.length} podcasts · Producción estudiantil</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} as="article">
                <div className="card" role="button" tabIndex={0} onClick={() => onOpenProj(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenProj(p); } }}>
                  <div className="kicker">{p.group || p.author}</div>
                  <div className="mt-1 font-mono text-[12px] sm:text-[10px] tracking-[0.1em] text-fg-mute">Podcast</div>
                  <h3 className="mt-2 text-[clamp(16px,1.6vw,20px)] font-serif leading-tight">
                    {p.title}
                  </h3>

                  {p.url && getSpotifyEmbedUrl(p.url) && (
                    <div className="mt-4 h-[152px]" onClick={(e) => e.stopPropagation()}>
                      <iframe
                        src={getSpotifyEmbedUrl(p.url)!}
                        width="100%"
                        height="100%"
                        allow="encrypted-media; clipboard-write"
                        className="border-0 rounded-xl"
                        title={p.title}
                      />
                    </div>
                  )}

                  {p.id === 13 && PODCAST_SERIES.episodes.length > 0 && (
                    <details className="mt-4 pt-3 border-t border-[var(--line)]" onClick={(e) => e.stopPropagation()}>
                      <summary className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute cursor-pointer">
                        {PODCAST_SERIES.episodes.length} episodios
                      </summary>
                      <div className="mt-3 space-y-2">
                        {PODCAST_SERIES.episodes.map((e, j) => (
                          <a
                            key={j}
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-fg-mute hover:text-fg transition-colors no-underline"
                          >
                            <span className="font-mono text-[12px] text-accent shrink-0">EP.{e.n}</span>
                            <span className="flex-1">{e.title}</span>
                            <span className="w-3.5 h-3.5 shrink-0 flex items-center"><Icon.External /></span>
                          </a>
                        ))}
                      </div>
                    </details>
                  )}

                  {p.id === 26 && p.links && p.links.length > 0 && (
                    <details className="mt-4 pt-3 border-t border-[var(--line)]" onClick={(e) => e.stopPropagation()}>
                      <summary className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute cursor-pointer">
                        {p.links.length} episodios
                      </summary>
                      <div className="mt-3 space-y-2">
                        {p.links.map((l, j) => (
                          <a
                            key={j}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-fg-mute hover:text-fg transition-colors no-underline"
                          >
                            <span className="flex-1">{l.label}</span>
                            <span className="w-3.5 h-3.5 shrink-0 flex items-center"><Icon.External /></span>
                          </a>
                        ))}
                      </div>
                    </details>
                  )}

                  <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <Link to="/archivo" className="btn terra w-full justify-center">
                      Ver en Archivo
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
