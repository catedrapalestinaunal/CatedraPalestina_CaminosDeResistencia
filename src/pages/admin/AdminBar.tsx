import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { ArrowLeft, Plus, LogOut, Layers, Calendar, AlertTriangle } from 'lucide-react';

interface AdminBarProps {
  onSemestersClick?: () => void;
  onNewClick?: () => void;
  context?: 'projects' | 'events';
}

export function AdminBar({ onSemestersClick, onNewClick, context = 'projects' }: AdminBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [healthError, setHealthError] = useState(false);
  const isDashboard = location.pathname === '/admin';
  const isEventsDashboard = location.pathname === '/admin/events';
  const isNew = location.pathname.includes('/new');
  const isEdit = location.pathname.includes('/edit');
  const isEventsSection = context === 'events';

  useEffect(() => {
    fetch('/api/ping', { method: 'GET' })
      .then(r => { if (!r.ok) setHealthError(true); })
      .catch(() => setHealthError(true));
  }, []);

  const getTitle = () => {
    if (isDashboard) return 'Proyectos';
    if (isEventsDashboard) return 'Eventos';
    if (isNew) return isEventsSection ? 'Nuevo evento' : 'Nuevo proyecto';
    if (isEdit) return isEventsSection ? 'Editar evento' : 'Editar proyecto';
    return isEventsSection ? 'Eventos' : 'Proyectos';
  };

  const getBackPath = () => {
    if (isEventsSection) return '/admin/events';
    return '/admin';
  };

  return (
    <>
      {healthError && (
        <div className="flex items-center gap-2 px-5 py-2 rounded-xl border border-accent/30 bg-accent/5 text-accent font-mono text-[10px] tracking-[0.12em] uppercase">
          <AlertTriangle size={12} />
          El servicio de base de datos no responde. Si el problema persiste, restaura el proyecto en Supabase Dashboard.
        </div>
      )}
      <div className="flex items-center justify-between gap-4 py-3 px-5 rounded-xl border border-[var(--line)] bg-[var(--bg-warm)]">
      <div className="flex items-center gap-3 min-w-0">
        {!isDashboard && !isEventsDashboard && (
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-accent transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            {isEventsSection ? 'Eventos' : 'Proyectos'}
          </button>
        )}
        <span className="hidden sm:block w-px h-5 bg-[var(--line)]" />
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-fg truncate">
          {getTitle()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {(isDashboard || isEventsDashboard) && (
          <>
            {isDashboard && onSemestersClick && (
              <button
                onClick={onSemestersClick}
                className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-accent transition-colors"
              >
                <Layers size={14} />
                Semestres
              </button>
            )}
            {isDashboard && (
              <button
                onClick={() => navigate('/admin/events')}
                className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-accent transition-colors"
              >
                <Calendar size={14} />
                Eventos
              </button>
            )}
            {isEventsDashboard && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-accent transition-colors"
              >
                <ArrowLeft size={14} />
                Proyectos
              </button>
            )}
            <button
              onClick={onNewClick ?? (() => navigate(isEventsSection ? '/admin/events/new' : '/admin/projects/new'))}
              className="btn terra"
              style={{ padding: '7px 14px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}
            >
              <Plus size={14} />
              {isEventsSection ? 'Nuevo evento' : 'Nuevo proyecto'}
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-accent transition-colors"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
}
