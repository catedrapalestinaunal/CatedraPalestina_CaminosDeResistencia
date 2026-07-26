import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { VALID_KINDS, getAuthenticatedUser, requireEnv } from '../_shared.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(
    requireEnv('VITE_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_KEY'),
  );

  try {
    await getAuthenticatedUser(req);
  } catch {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const projectId = Number(id);
  if (Number.isNaN(projectId)) {
    return res.status(400).json({ error: 'ID debe ser un número' });
  }

  if (req.method === 'GET') {
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
    if (!data) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const body = req.body;

    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
      return res.status(400).json({ error: 'El título no puede estar vacío' });
    }
    if (body.kind !== undefined && !VALID_KINDS.includes(body.kind)) {
      return res.status(400).json({ error: 'Tipo de proyecto inválido' });
    }

    if (body.year !== undefined) {
      if (typeof body.year !== 'string' || body.year.trim().length === 0) {
        return res.status(400).json({ error: 'El semestre no puede estar vacío' });
      }
      const { data: semester } = await supabase
        .from('semesters')
        .select('id')
        .eq('name', body.year)
        .maybeSingle();
      if (!semester) {
        return res.status(400).json({ error: `El semestre "${body.year}" no existe. Créalo primero desde la gestión de semestres.` });
      }
    }

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.kind !== undefined) updates.kind = body.kind;
    if (body.author !== undefined) updates.author = body.author.trim();
    if (body.year !== undefined) updates.year = body.year;
    if (body.n !== undefined) updates.n = body.n;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.description !== undefined) updates.description = body.description?.trim() ?? null;
    if (body.url !== undefined) updates.url = body.url?.trim() ?? null;
    if (body.urlAlt !== undefined) updates.url_alt = body.urlAlt?.trim() ?? null;
    if (body.links !== undefined) updates.links = body.links;
    if (body.linkLabel !== undefined) updates.link_label = body.linkLabel?.trim() ?? null;
    if (body.thumbnail !== undefined) updates.thumbnail = body.thumbnail?.trim() ?? null;
    if (body.aiThumbnail !== undefined) updates.ai_thumbnail = !!body.aiThumbnail;
    if (body.members !== undefined) updates.members = body.members;
    if (body.groupName !== undefined) updates.group_name = body.groupName?.trim() ?? null;

    const { data, error: updateError } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }
    if (!data) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { data, error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .select()
      .single();

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
    if (!data) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    return res.status(200).json({ message: 'Proyecto eliminado', id: projectId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
