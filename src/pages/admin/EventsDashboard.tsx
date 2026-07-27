import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import { getSupabase } from '../../lib/getSupabase';
import { Reveal } from '../../components/Reveal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { AdminBar } from './AdminBar';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { EventRow } from '../../types/database';

export function EventsDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EventRow | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const sb = await getSupabase();
    const token = (await sb.auth.getSession()).data.session?.access_token;
    if (!token) { navigate('/admin/login', { replace: true }); return; }
    const res = await fetch('/api/admin/events', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    setDeleteError(null);
    const sb = await getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const token = session?.access_token;
    if (!token) { setDeleting(null); navigate('/admin/login', { replace: true }); return; }
    const res = await fetch(`/api/admin/events?id=${id}`, {
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
    await loadEvents();
    setDeleting(null);
  };

  const today = new Date().toISOString().split('T')[0];
  const isActive = (eventDate: string) => eventDate >= today;

  return (
    <div className="section">
      <div className="wrap">
        <Reveal>
          <AdminBar onNewClick={() => navigate('/admin/events/new')} context="events" />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6 mb-6">
            <div>
              <div className="eyebrow">Admin</div>
              <h1 className="admin-h1 mt-2">Eventos</h1>
              <p className="text-fg-mute text-sm mt-1">{events.length} registros</p>
            </div>
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
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="font-serif text-3xl">Sin eventos</div>
              <p className="text-fg-mute text-sm mt-2">Crea el primer evento desde el botón superior.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="admin-card flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-serif text-lg truncate">{e.title}</h3>
                      <span className={`font-mono text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full ${isActive(e.event_date) ? 'bg-primary/10 text-primary' : 'bg-[var(--terracotta-soft)] text-accent'}`}>
                        {isActive(e.event_date) ? 'Activo' : 'Pasado'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-fg-mute font-mono text-[11px]">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {e.event_date}</span>
                      {e.event_time && <span className="flex items-center gap-1"><Clock size={12} /> {e.event_time}</span>}
                      {e.place && <span className="flex items-center gap-1"><MapPin size={12} /> {e.place}</span>}
                    </div>
                    {e.description && (
                      <p className="text-sm text-fg-mute mt-2 line-clamp-2">{e.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      className="font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-fg transition-colors"
                      onClick={() => navigate(`/admin/events/${e.id}/edit`)}
                    >
                      Editar
                    </button>
                    <button
                      className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent hover:text-accent/70 transition-colors disabled:opacity-40"
                      disabled={deleting === e.id}
                      onClick={() => setConfirmDelete(e)}
                    >
                      {deleting === e.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <ConfirmDialog
          open={confirmDelete !== null}
          title="Eliminar evento"
          message={`¿Eliminar "${confirmDelete?.title}"?`}
          onConfirm={() => { if (confirmDelete) { handleDelete(confirmDelete.id); setConfirmDelete(null); } }}
          onCancel={() => setConfirmDelete(null)}
        />
      </div>
    </div>
  );
}
