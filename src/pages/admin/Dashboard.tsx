import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import { getSupabase } from '../../lib/getSupabase';
import { Reveal } from '../../components/Reveal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AdminBar } from './AdminBar';
import { SemesterModal } from './SemesterModal';
import type { ProjectRow } from '../../types/database';

interface Semester {
  id: number;
  name: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [filterSemester, setFilterSemester] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProjectRow | null>(null);
  const [semesterModalOpen, setSemesterModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    const sb = await getSupabase();
    const { data } = await sb
      .from('projects')
      .select('*')
      .order('id', { ascending: true });
    if (data) setProjects(data);
    setLoading(false);
  }, []);

  const loadSemesters = useCallback(async () => {
    const sb = await getSupabase();
    const token = (await sb.auth.getSession()).data.session?.access_token;
    if (!token) return;
    const res = await fetch('/api/admin/semesters', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSemesters(data);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);
  useEffect(() => { loadSemesters(); }, [loadSemesters]);

  const filtered = useMemo(
    () => (filterSemester ? projects.filter((p) => p.year === filterSemester) : projects),
    [projects, filterSemester],
  );

  const handleDelete = async (id: number) => {
    setDeleting(id);
    setDeleteError(null);
    const sb = await getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    if (!token) { setDeleting(null); navigate('/admin/login', { replace: true }); return; }
    const res = await fetch(`/api/admin/projects?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { setDeleting(null); navigate('/admin/login', { replace: true }); return; }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Error al eliminar' }));
      setDeleteError(err.error ?? 'Error al eliminar');
      setDeleting(null);
      return;
    }
    await loadProjects();
    setDeleting(null);
  };

  return (
    <div className="section">
      <div className="wrap">
        <Reveal>
          <AdminBar onSemestersClick={() => setSemesterModalOpen(true)} />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow">Admin</div>
                <h1 className="admin-h1 mt-2">Proyectos</h1>
                <p className="text-fg-mute text-sm mt-1">{filtered.length} registros</p>
              </div>
            </div>

            {semesters.length > 0 && (
              <div className="subtabs">
                <button
                  onClick={() => setFilterSemester(null)}
                  className={`subtab ${filterSemester === null ? 'is-active' : ''}`}
                >
                  Todos
                </button>
                {semesters.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFilterSemester(s.name)}
                    className={`subtab ${filterSemester === s.name ? 'is-active' : ''}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {deleteError && (
            <div className="text-accent text-sm mb-4">{deleteError}</div>
          )}
          {loading ? (
            <div className="text-center py-12 text-fg-mute font-mono text-xs tracking-[0.14em] uppercase">
              Cargando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="font-serif text-3xl">Sin proyectos</div>
              <p className="text-fg-mute text-sm mt-2">
                {filterSemester ? 'No hay proyectos en este semestre.' : 'Crea el primer proyecto desde el botón superior.'}
              </p>
            </div>
          ) : (
            <div className="touch-scroll">
              <table className="w-full text-sm">
                <thead>
                  <tr className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg-mute border-b border-[var(--line)]">
                    <th className="text-left py-3 pr-4">N°</th>
                    <th className="text-left py-3 pr-4">Título</th>
                    <th className="text-left py-3 pr-4">Grupo</th>
                    <th className="text-left py-3 pr-4">Tipo</th>
                    <th className="text-left py-3 pr-4">Semestre</th>
                    <th className="text-right py-3 pl-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-[var(--line)] hover:bg-[var(--olive-soft)]/30 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs">{p.n}</td>
                      <td className="py-3 pr-4 font-medium max-w-xs truncate">{p.title}</td>
                      <td className="py-3 pr-4 text-fg-mute">{p.group_name ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent">{p.kind}</span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">{p.year}</td>
                      <td className="py-3 pl-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-fg transition-colors"
                            onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                          >
                            Editar
                          </button>
                          <button
                             className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent hover:text-accent/70 transition-colors disabled:opacity-40"
                             disabled={deleting === p.id}
                             onClick={() => setConfirmDelete(p)}
                           >
                             {deleting === p.id ? 'Eliminando...' : 'Eliminar'}
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Reveal>
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Eliminar proyecto"
        message={`¿Eliminar "${confirmDelete?.title}"?`}
        onConfirm={() => { if (confirmDelete) { handleDelete(confirmDelete.id); setConfirmDelete(null); } }}
        onCancel={() => setConfirmDelete(null)}
      />

      <SemesterModal
        open={semesterModalOpen}
        onClose={() => setSemesterModalOpen(false)}
        onChanged={() => { loadSemesters(); loadProjects(); }}
      />
    </div>
  );
}
