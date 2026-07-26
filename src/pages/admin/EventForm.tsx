import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/admin.css';
import { X, ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Reveal } from '../../components/Reveal';
import { AdminBar } from './AdminBar';
import type { EventRow } from '../../types/database';

function getBogotaDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

function parseEventTime(timeStr: string): { start: string; end: string } {
  if (!timeStr) return { start: '', end: '' };
  const parts = timeStr.split('-').map(s => s.trim());
  if (parts.length === 0) return { start: '', end: '' };
  if (parts.length === 1) return { start: parts[0], end: '' };
  return { start: parts[0], end: parts[1] };
}

function formatEventTime(start: string, end: string): string {
  if (!start) return '';
  return end ? `${start} - ${end}` : start;
}

interface FormData {
  title: string;
  description: string;
  place: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  organizer: string;
  category: string;
  images: string[];
}

const INITIAL: FormData = {
  title: '',
  description: '',
  place: '',
  eventDate: '',
  startTime: '',
  endTime: '',
  organizer: '',
  category: '',
  images: [],
};

const CATEGORY_OPTIONS = [
  { value: 'conferencia', label: 'Conferencia' },
  { value: 'taller', label: 'Taller' },
  { value: 'proyeccion', label: 'Proyección' },
  { value: 'performance', label: 'Performance' },
  { value: 'conversatorio', label: 'Conversatorio' },
  { value: 'exposicion', label: 'Exposición' },
  { value: 'otro', label: 'Otro' },
];

export function EventForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('events')
      .select('*')
      .eq('id', Number(id))
      .single()
      .then(({ data: raw, error: err }) => {
        if (err || !raw) {
          navigate('/admin/events');
          return;
        }
        const data = raw as EventRow;
        const { start, end } = parseEventTime(data.event_time ?? '');
        setForm({
          title: data.title,
          description: data.description ?? '',
          place: data.place ?? '',
          eventDate: data.event_date,
          startTime: start,
          endTime: end,
          organizer: data.organizer ?? '',
          category: data.category ?? '',
          images: data.images ?? [],
        });
      });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar 5 MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) { navigate('/admin/login', { replace: true }); return; }

      const sigRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!sigRes.ok) throw new Error('Error al obtener firma de subida');
      const { signature, timestamp, cloudName, apiKey, uploadPreset } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('api_key', apiKey);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!cloudRes.ok) throw new Error('Error al subir imagen');
      const cloudData = await cloudRes.json();

      setForm((prev) => ({ ...prev, images: [...prev.images, cloudData.secure_url] }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!form.eventDate) {
      setError('La fecha del evento es obligatoria');
      return;
    }

    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const body = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      place: form.place.trim() || null,
      event_date: form.eventDate,
      event_time: formatEventTime(form.startTime, form.endTime) || null,
      organizer: form.organizer.trim() || null,
      category: form.category || null,
      images: form.images,
    };

    const url = isEdit ? `/api/admin/events?id=${id}` : '/api/admin/events';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      navigate('/admin/login', { replace: true });
      return;
    }

    if (!res.ok) {
      try {
        const err = await res.json();
        setError(err.error ?? 'Error al guardar');
      } catch {
        setError('Error al guardar (servidor no responde)');
      }
      setSaving(false);
      return;
    }

    navigate('/admin/events');
  };

  return (
    <div className="section">
      <div className="wrap max-w-3xl">
        <Reveal>
          <div className="eyebrow">Admin</div>
          <h1 className="admin-h1 mt-2">{isEdit ? 'Editar evento' : 'Nuevo evento'}</h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6">
            <AdminBar context="events" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* ======== Información básica ======== */}
            <fieldset className="admin-card">
              <legend className="admin-card-title">Información del evento</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="admin-field-label">Título *</label>
                  <input id="title" name="title" value={form.title} onChange={handleChange} required className="admin-input" placeholder="Nombre del evento" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="admin-field-label">Fecha del evento *</label>
                    <input id="eventDate" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required className="admin-input" min={getBogotaDate()} />
                  </div>
                  <div>
                    <label htmlFor="startTime" className="admin-field-label">Hora inicio</label>
                    <input id="startTime" name="startTime" type="time" value={form.startTime} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="admin-field-label">Hora final</label>
                    <input id="endTime" name="endTime" type="time" value={form.endTime} onChange={handleChange} className="admin-input" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="place" className="admin-field-label">Lugar</label>
                    <input id="place" name="place" value={form.place} onChange={handleChange} className="admin-input" placeholder="Auditorio principal" />
                  </div>
                  <div>
                    <label htmlFor="category" className="admin-field-label">Categoría</label>
                    <select id="category" name="category" value={form.category} onChange={handleChange} className="admin-input">
                      <option value="">Seleccionar categoría</option>
                      {CATEGORY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="organizer" className="admin-field-label">Organizador</label>
                  <input id="organizer" name="organizer" value={form.organizer} onChange={handleChange} className="admin-input" placeholder="Cátedra Caminos de Resistencia" />
                </div>

                <div>
                  <label htmlFor="description" className="admin-field-label">Descripción</label>
                  <textarea id="description" name="description" value={form.description} onChange={handleChange} className="admin-input" rows={4} placeholder="Descripción del evento" />
                </div>
              </div>
            </fieldset>

            {/* ======== Imágenes ======== */}
            <fieldset className="admin-card">
              <legend className="admin-card-title">Imágenes ({form.images.length})</legend>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((url, i) => (
                      <div key={i} className="upload-preview relative group">
                        <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-28 object-cover" />
                        <div className="upload-preview-overlay">
                          <button type="button" className="upload-preview-btn" onClick={() => handleRemoveImage(i)}>
                            <X size={12} style={{ display: 'inline', marginRight: 4 }} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {uploading ? (
                  <div className="upload-zone">
                    <div className="upload-status">
                      <div className="upload-spinner" />
                      Subiendo imagen…
                    </div>
                  </div>
                ) : (
                  <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { setUploadError('Solo se permiten imágenes'); return; } handleFileUpload(file); }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="upload-zone-icon">
                      <ImageIcon size={40} />
                    </div>
                    <div className="upload-zone-label">Arrastra una imagen o haz clic</div>
                    <div className="upload-zone-hint">PNG, JPG o WebP · Máx 5 MB</div>
                  </div>
                )}

                {uploadError && <div className="admin-error mt-2">{uploadError}</div>}
              </div>
            </fieldset>

            {error && <div className="admin-error">{error}</div>}

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={saving} className="btn terra">
                {saving ? 'Guardando…' : isEdit ? 'Actualizar evento' : 'Crear evento'}
              </button>
              <button type="button" className="btn" onClick={() => navigate('/admin/events')}>
                Cancelar
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
