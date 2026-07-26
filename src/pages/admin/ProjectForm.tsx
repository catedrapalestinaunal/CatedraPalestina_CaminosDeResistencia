import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/admin.css';
import { X, ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Reveal } from '../../components/Reveal';
import { AdminBar } from './AdminBar';
import type { ProjectRow } from '../../types/database';

interface Semester {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  kind: string;
  author: string;
  year: string;
  n: string;
  tags: string;
  description: string;
  url: string;
  urlAlt: string;
  linkLabel: string;
  links: { label: string; url: string }[];
  thumbnail: string;
  aiThumbnail: boolean;
  members: string;
  groupName: string;
}

const INITIAL: FormData = {
  title: '',
  kind: 'ensayo',
  author: '',
  year: '',
  n: '',
  tags: '',
  description: '',
  url: '',
  urlAlt: '',
  linkLabel: '',
  links: [],
  thumbnail: '',
  aiThumbnail: false,
  members: '',
  groupName: '',
};

const KIND_OPTIONS = [
  { value: 'ensayo', label: 'Ensayo' },
  { value: 'cartografia', label: 'Cartografía' },
  { value: 'video', label: 'Video' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'fanzine', label: 'Fanzine' },
  { value: 'mural', label: 'Mural' },
  { value: 'collage', label: 'Collage' },
  { value: 'grabado', label: 'Grabado' },
];

export function AdminProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;
      const res = await fetch('/api/admin/semesters', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSemesters(data);
      }
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('projects')
      .select('*')
      .eq('id', Number(id))
      .single()
      .then(({ data: raw, error: err }) => {
        if (err || !raw) {
          navigate('/admin');
          return;
        }
        const data = raw as ProjectRow;
        setForm({
          title: data.title,
          kind: data.kind,
          author: data.author,
          year: data.year,
          n: data.n,
          tags: (data.tags ?? []).join(', '),
          description: data.description ?? '',
          url: data.url ?? '',
          urlAlt: data.url_alt ?? '',
          linkLabel: data.link_label ?? '',
          links: data.links ?? [],
          thumbnail: data.thumbnail ?? '',
          aiThumbnail: data.ai_thumbnail,
          members: (data.members ?? []).join('\n'),
          groupName: data.group_name ?? '',
        });
      });
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    setForm((prev) => {
      const links = [...prev.links];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, links };
    });
  };

  const handleAddLink = () => {
    setForm((prev) => ({ ...prev, links: [...prev.links, { label: '', url: '' }] }));
  };

  const handleRemoveLink = (index: number) => {
    setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const isValidUrl = (str: string) => {
    if (!str) return true;
    try { new URL(str); return true; }
    catch { return false; }
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

      setForm((prev) => ({ ...prev, thumbnail: cloudData.secure_url }));
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, thumbnail: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.url && !isValidUrl(form.url)) {
      setError('La URL del proyecto debe comenzar con http:// o https://');
      return;
    }
    if (form.urlAlt && !isValidUrl(form.urlAlt)) {
      setError('La URL alternativa debe comenzar con http:// o https://');
      return;
    }
    if (form.links.some((l) => l.url && !isValidUrl(l.url))) {
      setError('Todas las URLs de enlaces deben comenzar con http:// o https://');
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
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      members: form.members.split('\n').map((m) => m.trim()).filter(Boolean),
      links: form.links.filter((l) => l.label || l.url),
    };

    const url = isEdit ? `/api/admin/${id}` : '/api/admin/projects';
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

    navigate('/admin');
  };

  return (
    <div className="section">
      <div className="wrap max-w-3xl">
        <Reveal>
          <div className="eyebrow">Admin</div>
          <h1 className="admin-h1 mt-2">{isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6">
            <AdminBar />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* ======== Información básica ======== */}
            <fieldset className="admin-card">
              <legend className="admin-card-title">Información básica</legend>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="admin-field-label">Título *</label>
                    <input id="title" name="title" value={form.title} onChange={handleChange} required className="admin-input" />
                  </div>
                  <div>
                    <label htmlFor="n" className="admin-field-label">N° proyecto *</label>
                    <input id="n" name="n" value={form.n} onChange={handleChange} required className="admin-input" placeholder="01" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="author" className="admin-field-label">Autor / Grupo</label>
                    <input id="author" name="author" value={form.author} onChange={handleChange} className="admin-input" placeholder="Grupo 1" />
                  </div>
                  <div>
                    <label htmlFor="groupName" className="admin-field-label">Nombre del grupo</label>
                    <input id="groupName" name="groupName" value={form.groupName} onChange={handleChange} className="admin-input" placeholder="Grupo 1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="kind" className="admin-field-label">Tipo</label>
                    <select id="kind" name="kind" value={form.kind} onChange={handleChange} className="admin-input">
                      {KIND_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="year" className="admin-field-label">Semestre *</label>
                    <select id="year" name="year" value={form.year} onChange={handleChange} required className="admin-input">
                      <option value="">Seleccionar semestre</option>
                      {semesters.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                      {isEdit && form.year && !semesters.some((s) => s.name === form.year) && (
                        <option value={form.year}>{form.year}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="tags" className="admin-field-label">Etiquetas</label>
                  <input id="tags" name="tags" value={form.tags} onChange={handleChange} className="admin-input" placeholder="video, memoria, arte" />
                </div>

                <div>
                  <label htmlFor="description" className="admin-field-label">Descripción</label>
                  <textarea id="description" name="description" value={form.description} onChange={handleChange} className="admin-input" rows={4} />
                </div>
              </div>
            </fieldset>

            {/* ======== Multimedia ======== */}
            <fieldset className="admin-card">
              <legend className="admin-card-title">Multimedia</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="project-thumbnail" className="admin-field-label">Miniatura</label>
                  <input
                    id="project-thumbnail"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {uploading ? (
                    <div className="upload-zone">
                      <div className="upload-status">
                        <div className="upload-spinner" />
                        Subiendo imagen…
                      </div>
                    </div>
                  ) : form.thumbnail ? (
                    <div className="upload-zone has-image" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                      <div className="upload-preview">
                        <img src={form.thumbnail} alt="Preview" />
                        <div className="upload-preview-overlay">
                          <button type="button" className="upload-preview-btn is-ghost" onClick={() => fileInputRef.current?.click()}>
                            Cambiar
                          </button>
                          <button type="button" className="upload-preview-btn" onClick={handleRemoveImage}>
                            <X size={12} style={{ display: 'inline', marginRight: 4 }} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="upload-zone"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
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

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="aiThumbnail" checked={form.aiThumbnail} onChange={handleChange} className="w-4 h-4 accent-accent" />
                  <span className="admin-field-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
                    Miniatura generada con IA
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="url" className="admin-field-label">URL del proyecto</label>
                    <input id="url" name="url" value={form.url} onChange={handleChange} className="admin-input" />
                  </div>
                  <div>
                    <label htmlFor="urlAlt" className="admin-field-label">URL alternativa</label>
                    <input id="urlAlt" name="urlAlt" value={form.urlAlt} onChange={handleChange} className="admin-input" />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* ======== Enlaces ======== */}
            <fieldset className="admin-card">
              <legend className="admin-card-title">Enlaces</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="linkLabel" className="admin-field-label">Etiqueta del enlace</label>
                  <input id="linkLabel" name="linkLabel" value={form.linkLabel} onChange={handleChange} className="admin-input" placeholder="Episodios" />
                </div>

                <div>
                  <label className="admin-field-label">Enlaces adicionales</label>
                  <div className="space-y-2">
                    {form.links.map((link, i) => (
                      <div key={i} className="admin-link-row">
                        <input
                          aria-label={`Etiqueta del enlace ${i + 1}`}
                          placeholder="Etiqueta"
                          value={link.label}
                          onChange={(e) => handleLinkChange(i, 'label', e.target.value)}
                          className="admin-input"
                          style={{ borderRadius: 6, padding: '8px 10px', fontSize: 13 }}
                        />
                        <input
                          aria-label={`URL del enlace ${i + 1}`}
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
                          className="admin-input"
                          style={{ borderRadius: 6, padding: '8px 10px', fontSize: 13 }}
                        />
                        <button type="button" onClick={() => handleRemoveLink(i)} aria-label={`Eliminar enlace ${i + 1}`}
                          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--line)] bg-transparent text-fg-mute hover:text-accent hover:border-accent transition-colors shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={handleAddLink}
                      className="font-mono text-[11px] tracking-[0.12em] uppercase text-fg-mute hover:text-fg transition-colors">
                      + Añadir enlace
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* ======== Equipo ======== */}
            <fieldset className="admin-card">
              <legend className="admin-card-title">Equipo</legend>
              <div>
                <label htmlFor="members" className="admin-field-label">Integrantes</label>
                <textarea id="members" name="members" value={form.members} onChange={handleChange} className="admin-input" rows={5} placeholder="Nombre Apellido (uno por línea)" />
              </div>
            </fieldset>

            {error && <div className="admin-error">{error}</div>}

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={saving}
                className="btn terra">
                {saving ? 'Guardando…' : isEdit ? 'Actualizar proyecto' : 'Crear proyecto'}
              </button>
              <button type="button" className="btn" onClick={() => navigate('/admin')}>
                Cancelar
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
