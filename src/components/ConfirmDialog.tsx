import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Eliminar', variant = 'danger', onConfirm, onCancel }: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      dialogRef.current?.focus();
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal-veil"
      onClick={onCancel}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease' }}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 440,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--terracotta-soft)] flex items-center justify-center shrink-0 mt-1">
            <AlertTriangle size={20} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="font-serif text-xl" style={{ color: 'var(--fg)' }}>{title}</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--fg-mute)' }}>{message}</p>
          </div>
          <button className="close" onClick={onCancel} aria-label="Cerrar" style={{ position: 'static', width: 32, height: 32 }}>
            <X size={14} />
          </button>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className={variant === 'danger' ? 'btn terra' : 'btn solid'}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
