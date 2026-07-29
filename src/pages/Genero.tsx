import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/genero.css';
import { Reveal } from '../components/Reveal';
import { ImageSlot } from '../components/ImageSlot';
import { ImageBook } from '../components/ImageBook';
import { ProjectModal } from '../components/ProjectModal';
import { FANZINE_G12 } from '../data/fanzine-g12';
import { useProjects } from '../lib/useProjects';
import { Icon } from '../lib/icons';
import type { Project } from '../lib/types';
import { OG_IMAGE, SITE_URL, SITE_NAME, SITE_LOCALE } from '../lib/seo';
import { CONFIG } from '../lib/config';
import { articleSchema, breadcrumbSchema } from '../lib/seo-schema';

/* ============================================================
   QuotesMarquee — impactful quote block
   ============================================================ */
interface QuotesMarqueeProps {
  quote?: string;
  author?: string;
  source?: string;
  theme?: 'dark' | 'light';
}

function QuotesMarquee({
  quote   = '«Bastará para mí / morir en esta tierra, / en su seno verde, / bajo sus olivos y su hierba»',
  author  = 'Fadwa Tuqan',
  source  = '«Bastará para mí» · 1952',
  theme   = 'dark',
}: QuotesMarqueeProps) {
  return (
    <section className={'qm-section section ' + (theme === 'dark' ? 'qm-dark' : 'qm-light')}>
      <div className="qm-bg-deco" aria-hidden="true" />
      <div className="wrap">
        <Reveal>
          <div className="qm-inner">
            <span className="qm-openmark" aria-hidden="true">"</span>
            <blockquote className="qm-quote">{quote}</blockquote>
            <footer className="qm-attrib">
              <span className="qm-author">{author}</span>
              <span className="qm-sep" aria-hidden="true">·</span>
              <cite className="qm-source">{source}</cite>
            </footer>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   EstudianteCard — used in producción estudiantil section
   ============================================================ */
function EstudianteCard({ p, delay, onOpenProj }: { p: Project; delay: number; onOpenProj: (p: Project) => void }) {
  return (
    <Reveal as="article" delay={delay}>
      <div className="pdt-card-modern flex flex-col h-full" role="button" tabIndex={0} onClick={() => onOpenProj(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenProj(p); } }}>
        <div className="kicker mb-3">{p.group || p.author}</div>
        <div className="font-mono text-[12px] sm:text-[10px] tracking-[0.1em] text-fg-mute mb-2">{({ ensayo: 'Ensayo', cartografia: 'Cartografía', video: 'Video', podcast: 'Podcast', fanzine: 'Fanzine', mural: 'Mural', collage: 'Collage', grabado: 'Grabado' } as Record<string, string>)[p.kind] || p.kind}</div>
        <h3 className="font-serif text-[clamp(16px,1.6vw,20px)] leading-tight">
          {p.title}
        </h3>
        <div className="mt-auto pt-4" onClick={(e) => e.stopPropagation()}>
          <Link to="/archivo" className="btn terra w-full justify-center">
            Ver en Archivo
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ============================================================
   PalestinaDeTodas — editorial gender section
   ============================================================ */
const GENDER_DATA = {
  mentalHealth: [
    'Aproximadamente el 96 % de la niñez en Gaza presenta síntomas severos de crisis psicosocial (Alliance CPHA, 2026), y UNICEF estima que casi la totalidad de los 1,2 millones de niños del territorio requiere intervención urgente en salud mental (UNICEF, 2024).',
    'La fragmentación familiar —causada por desplazamiento y checkpoints— recae principalmente sobre las mujeres como cuidadoras primarias.',
    'La demolición de hogares destruye simultáneamente los centros emocionales del tejido familiar: la cocina, el jardín, el cuarto de los hijos.',
    'El duelo sin cuerpo —la imposibilidad de enterrar y llorar a los muertos— genera traumas de duelo complejo documentados por Médicos Sin Fronteras.',
  ],
  systemicViolence: [
    'Los checkpoints militares bloquean el acceso a hospitales: al menos 68 mujeres palestinas se vieron obligadas a dar a luz en puestos de control entre 2000 y 2006, con 35 recién nacidos fallecidos y 5 muertes maternas (ACNUDH, 2007).',
    'Las detenidas palestinas enfrentan aislamiento, denegación de atención médica y violencia de género institucional (Addameer, 2023).',
    'El bloqueo de Gaza impide el acceso a anticonceptivos, oncológicos y medicación prenatal.',
    'Siete periodistas mujeres asesinadas en Gaza entre octubre de 2023 y mayo de 2024 (CPJ). A mediados de 2026, la cifra acumulada de periodistas asesinados en la región asciende a 259, la mayoría palestinos en Gaza (CPJ, 2026).',
  ],
  leadershipSumud: {
    nationalDay: '26 oct.',
    nationalDayNote: 'Día Nacional de la Mujer Palestina · declarado por la Unión General de Mujeres Palestinas desde 1965',
    politicalQuota: '30 %',
    politicalQuotaNote: 'Meta mínima de participación femenina en cargos electivos — Ley Electoral Palestina',
    students: '1.673',
    studentsNote: 'Estudiantes en escuelas «Desafío» de la UNRWA — educación en emergencia prolongada',
  },
};

function PalestinaDeTodas() {
  const { projects } = useProjects();
  return (
    <>
      {/* ── INTRO · Sumud ─────────────────────────────────────── */}
      <Reveal>
        <div className="pdt-intro">
          <div className="pdt-intro-grid">
            <h2 className="pdt-intro-title">
              La firmeza<br />
              <em className="text-accent italic">que sostiene</em><br />
              el mundo
            </h2>
            <div className="pdt-intro-body">
              <p>
                <strong>Sumud</strong> — صمود — es la palabra árabe que describe la
                resistencia arraigada en la cotidianidad: el acto de quedarse, cultivar, enseñar,
                parir y criar bajo ocupación. No es heroísmo extraordinario; es la arquitectura
                invisible que sostiene una sociedad en permanente estado de emergencia.
              </p>
              <p className="mt-[18px]">
                Las mujeres palestinas son las principales portadoras del sumud. Administran hogares
                que pueden ser demolidos de un día para otro, sostienen duelos sin cuerpo, mantienen
                escuelas que funcionan bajo bombardeos. Esta sección documenta esa carga
                —y esa fuerza— con la seriedad que merece.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── TWO-COLUMN GRID ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ========== LEFT COLUMN ========== */}
        <div className="flex flex-col gap-8">

          {/* Salud Mental y Cuidado */}
          <Reveal>
            <div className="pdt-card-modern">
              <h3 className="kicker mb-4">
                / Salud mental y cuidado
              </h3>
              <ImageSlot
                height={180}
                src="/images/archive/2025-I/thumbs/10_Collage_Grupo10_MujerPalestina.webp"
                alt="Collage · Mujer Palestina: Resistencia entre el Conflicto y Esperanza · Grupo 10"
                label="Mujer palestina en espacio de refugio · retrato documental"
                variant="olive"
                credit="Collage elaborado por el Grupo 10 (2025-I) en el marco del módulo final de la Cátedra Caminos de Resistencia. Reproducción digital con fines estrictamente pedagógicos y de memoria (Uso Justo)."
                className="group"
              />
              <ul className="pdt-list">
                {GENDER_DATA.mentalHealth.map((item, i) => (
                  <li key={i} className="pdt-list-item">
                    <span className="pdt-list-n">{String(i + 1).padStart(2, '0')}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Violencia Sistémica */}
          <Reveal delay={0.08}>
            <div className="pdt-card-modern pdt-warning-card">
              <h3 className="kicker text-accent mb-1">
                / Violencia sistémica
              </h3>
              <div className="pdt-alert-bar">
                <span className="pdt-alert-dot" aria-hidden="true" />
                Contenido documentado · tratado con la solemnidad que merece
              </div>
              <ul className="pdt-list mt-2">
                {GENDER_DATA.systemicViolence.map((item, i) => (
                  <li key={i} className="pdt-list-item pdt-list-item--alert">
                    <span className="pdt-list-n pdt-list-n--alert">{String(i + 1).padStart(2, '0')}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

        </div>

        {/* ========== RIGHT COLUMN · Stats ========== */}
        <div className="flex flex-col gap-8">

          <Reveal>
            <div className="pdt-stat-card">
              <div className="pdt-stat-number">{GENDER_DATA.leadershipSumud.nationalDay}</div>
              <div className="pdt-stat-label">{GENDER_DATA.leadershipSumud.nationalDayNote}</div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="pdt-stat-card">
              <div className="pdt-stat-number">{GENDER_DATA.leadershipSumud.politicalQuota}</div>
              <div className="pdt-stat-label">{GENDER_DATA.leadershipSumud.politicalQuotaNote}</div>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="pdt-stat-card">
              <div className="pdt-stat-number">{GENDER_DATA.leadershipSumud.students}</div>
              <div className="pdt-stat-label">{GENDER_DATA.leadershipSumud.studentsNote}</div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Link to="/voces" className="btn mt-2">
              Periodismo y voces desde Gaza <Icon.Arrow />
            </Link>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="flex flex-col gap-4">
              <ImageBook
                pages={FANZINE_G12.pages}
                label={FANZINE_G12.label}
                credit={FANZINE_G12.credit}
              />
              <a
                href={projects.find(p => p.id === 12)?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn terra self-start"
              >
                Abrir fanzine <Icon.External />
              </a>
              <Link to="/archivo" className="btn self-start">
                Fanzine G12 completo <Icon.Arrow />
              </Link>
            </div>
          </Reveal>

        </div>

      </div>

      <Reveal>
        <details className="mt-12 group">
          <summary className="font-mono text-[11px] tracking-[0.18em] uppercase text-fg-mute cursor-pointer hover:text-accent transition-colors">
            Fuentes y metodología
          </summary>
          <div className="mt-4 p-5 bg-[var(--bg-warm)] border border-[var(--line)] rounded-[14px] text-[13px] text-fg-mute leading-relaxed space-y-2">
            <p><strong>Salud mental infantil:</strong> UNICEF, <em>The Gaza Child-Focused Assessment</em> (2026); Alliance CPHA, <em>Putting the Pieces back Together</em> (2026).</p>
            <p><strong>Partos en puestos de control:</strong> ACNUDH, <em>Palestinian women giving birth at checkpoints</em> (A/HRC/4/57, 2007); Ministerio de Salud de Palestina / WAFA (2023).</p>
            <p><strong>Periodistas asesinadas:</strong> CPJ, <em>Journalist casualties in the Israel-Gaza war</em>, base de datos actualizada a 2026.</p>
          </div>
        </details>
      </Reveal>
    </>
  );
}

/* ============================================================
   Main Genero page
   ============================================================ */
export function Genero() {
  const { projects } = useProjects();
  const [openProj, setOpenProj] = useState<Project | null>(null);
  return (
    <>
      <Helmet>
        <title>Género · Cátedra Caminos de Resistencia</title>
        <meta name="description" content="Palestina de Todas: feminismo palestino, salud mental infantil en Gaza, violencia sistémica y resistencia de las mujeres palestinas bajo ocupación israelí. 96% de la niñez en Gaza en crisis psicosocial · Cátedra UNAL, Bogotá." />
        <meta property="og:title" content="Género · Cátedra Caminos de Resistencia" />
        <meta property="og:description" content="Palestina de Todas: feminismo palestino, salud mental infantil Gaza, violencia sistémica y liderazgo de las mujeres palestinas bajo ocupación · UNAL Bogotá, Colombia." />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={`${SITE_URL}/genero`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content={SITE_LOCALE} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Género · Cátedra Caminos de Resistencia" />
        <meta name="twitter:description" content="Palestina de Todas: feminismo palestino, salud mental infantil Gaza y liderazgo de las mujeres palestinas · UNAL Bogotá." />
        <link rel="canonical" href={`${SITE_URL}/genero`} />
        <script type="application/ld+json">
          {JSON.stringify([
            breadcrumbSchema([
              { name: 'Inicio', url: '/' },
              { name: 'Género', url: '/genero' },
            ]),
            articleSchema(
              'Palestina de todas · Género y resistencia',
              'Feminismo palestino, salud mental infantil en Gaza, violencia sistémica y liderazgo de las mujeres palestinas bajo ocupación israelí.'
            ),
          ])}
        </script>
      </Helmet>
      {/* ── CABECERA ───────────────────────────────────────────── */}
      <header className="page-head">
        <div className="wrap">
          <div className="row">
            <div>
              <Reveal>
                <div className="eyebrow"><span className="dot" />Página 04 · Género</div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-[18px]">
                  Palestina<br />
                  <em className="text-accent italic">de todas</em>
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <div>
                <p className="lede">
                  La ocupación no es neutra en términos de género. Las mujeres palestinas son
                  portadoras del sumud, cuidadoras del tejido social y objetivo específico de la
                  violencia sistémica.
                  <br /><br />
                  <strong>Esta sección documenta esa doble carga —y esa doble fuerza.</strong>
                </p>
                <div className="mt-7 flex gap-2.5 flex-wrap">
                  <div className="pdt-pill">صمود · Sumud</div>
                  <div className="pdt-pill">Salud mental</div>
                  <div className="pdt-pill">Violencia sistémica</div>
                  <div className="pdt-pill">Liderazgo</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────── */}
      <section className="section !pt-0">
        <div className="wrap">
          <PalestinaDeTodas />
        </div>
      </section>

      {/* ── PRODUCCIÓN ESTUDIANTIL ────────────────────────────── */}
      <section className="section !pt-0">
        <div className="wrap">
          <Reveal>
            <h2 className="hr-rule mb-10">
              <span>Voces desde el aula · proyectos {CONFIG.SEMESTRE}</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => [10, 5, 12].includes(p.id)).map((p, i) => (
              <EstudianteCard key={p.id} p={p} delay={i * 0.08} onOpenProj={setOpenProj} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CITA DE CIERRE ────────────────────────────────────── */}
      <QuotesMarquee
        quote="«Bastará para mí / morir en esta tierra, / en su seno verde, / bajo sus olivos y su hierba»"
        author="Fadwa Tuqan"
        source="«Bastará para mí» · 1952"
        theme="dark"
      />

      {/* ── NOTA INSTITUCIONAL ────────────────────────────────── */}
      <section className="section !pt-6 !pb-20">
        <div className="wrap">
          <Reveal>
            <div className="reading-note">
              <div>
                <div className="reading-note-eyebrow">
                  Nota metodológica
                </div>
                <p className="reading-note-body">
                  Los datos aquí presentados provienen de organizaciones documentales independientes.
                  El análisis de género no es auxiliar al conflicto —<em>es constitutivo de él.</em>
                </p>
              </div>
              <button className="btn terra" disabled>
                Descargar ficha · PDF
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <ProjectModal project={openProj} onClose={() => setOpenProj(null)} />
    </>
  );
}
