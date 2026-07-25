import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import { useProjects } from '../lib/useProjects';
import type { Project } from '../lib/types';

const ProjectModal = lazy(() => import('./ProjectModal').then(m => ({ default: m.ProjectModal })));

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

export function FeaturedProjects() {
  const { projects, loading, error, refetch } = useProjects({ defer: true });
  const [openProj, setOpenProj] = useState<Project | null>(null);
  const featuredIds = [3, 14, 25, 17, 23, 12];
  const featuredProjects = projects.filter(p => featuredIds.includes(p.id));

  return (
    <>
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
                  <div className="mt-1 font-mono text-[12px] sm:text-[10px] tracking-[0.1em] text-fg-mute">{KIND_GLYPH_LOCAL[p.kind] || p.kind}</div>
                  <h3 className="mt-2 text-[clamp(16px,1.6vw,20px)] font-serif leading-tight">
                    {p.title}
                  </h3>
                </div>
                <div className="mt-4">
                  <Link to="/archivo" className="btn terra w-full justify-center">
                    Ver en Archivo
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <Suspense fallback={null}>
        <ProjectModal project={openProj} onClose={() => setOpenProj(null)} />
      </Suspense>
    </>
  );
}
