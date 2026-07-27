import { useEffect, useState } from 'react';
import { X, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ConfirmDialog } from '../../components/ConfirmDialog';

interface Semester {
  id: number;
  name: string;
}

interface SemesterModalProps {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

export function SemesterModal({ open, onClose, onChanged }: SemesterModalProps) {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Semester | null>(null);

  const fetchSemesters = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/semesters', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error('Error al cargar semestres');
      const data = await res.json();
      setSemesters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchSemesters();
  }, [open]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/semesters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Error al crear');
      }
      setName('');
      await fetchSemesters();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (semester: Semester) => {
    setDeletingId(semester.id);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/semesters?id=${semester.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Error al eliminar');
      }
      await fetchSemesters();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-veil" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <button className="close" onClick={onClose}>
          <X size={16} />
        </button>

        <h2 className="font-serif text-2xl mb-1">Semestres</h2>
        <p className="text-fg-mute text-sm mb-6">
          Crea o elimina semestres. No se puede eliminar un semestre con proyectos asignados.
        </p>

        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: 2026-I"
            className="admin-input flex-1"
            style={{ borderRadius: 8, padding: '9px 12px', fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="btn terra"
            style={{ padding: '9px 16px', fontSize: 12 }}
          >
            <Plus size={14} />
            Crear
          </button>
        </form>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-[var(--terracotta-soft)] text-accent text-sm">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && error && semesters.length === 0 && (
          <div className="text-center py-3 mb-2 text-fg-mute text-sm">
            Verifica la conexión con el servidor e intenta de nuevo.
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-fg-mute font-mono text-xs tracking-[0.14em] uppercase">
            Cargando…
          </div>
        ) : semesters.length === 0 ? (
          <div className="text-center py-8 text-fg-mute text-sm">
            No hay semestres. Crea el primero arriba.
          </div>
        ) : (
          <div className="space-y-1.5">
            {semesters.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-lg border border-[var(--line)]"
              >
                <span className="font-mono text-sm tracking-[0.05em]">{s.name}</span>
                <button
                  onClick={() => setConfirmDelete(s)}
                  disabled={deletingId === s.id}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-accent hover:text-accent/70 transition-colors disabled:opacity-40"
                >
                  {deletingId === s.id ? '…' : <><Trash2 size={12} /> Eliminar</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Eliminar semestre"
        message={`¿Eliminar el semestre "${confirmDelete?.name}"? No se puede eliminar si tiene proyectos asignados.`}
        onConfirm={() => { if (confirmDelete) { handleDelete(confirmDelete); setConfirmDelete(null); } }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
