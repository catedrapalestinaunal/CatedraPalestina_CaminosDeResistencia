import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser, requireEnv } from '../_shared.js';

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

  const eventId = req.query.id ? Number(req.query.id) : null;

  if (req.method === 'GET') {
    if (eventId && !Number.isNaN(eventId)) {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        return res.status(500).json({ error: 'Error al obtener el evento' });
      }
      if (!data) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      return res.status(200).json(data);
    }

    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }

    return res.status(200).json(data ?? []);
  }

  if (req.method === 'POST') {
    const body = req.body;

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    if (!body.event_date || typeof body.event_date !== 'string') {
      return res.status(400).json({ error: 'La fecha del evento es obligatoria' });
    }

    const { data, error: insertError } = await supabase
      .from('events')
      .insert({
        title: body.title.trim(),
        description: body.description?.trim() ?? null,
        place: body.place?.trim() ?? null,
        event_date: body.event_date,
        event_time: body.event_time?.trim() ?? null,
        organizer: body.organizer?.trim() ?? null,
        category: body.category?.trim() ?? null,
        images: Array.isArray(body.images) ? body.images : [],
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Error al crear el evento' });
    }

    return res.status(201).json(data);
  }

  if (req.method === 'PUT') {
    if (!eventId || Number.isNaN(eventId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const body = req.body;

    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
      return res.status(400).json({ error: 'El título no puede estar vacío' });
    }

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.description !== undefined) updates.description = body.description?.trim() ?? null;
    if (body.place !== undefined) updates.place = body.place?.trim() ?? null;
    if (body.event_date !== undefined) updates.event_date = body.event_date;
    if (body.event_time !== undefined) updates.event_time = body.event_time?.trim() ?? null;
    if (body.organizer !== undefined) updates.organizer = body.organizer?.trim() ?? null;
    if (body.category !== undefined) updates.category = body.category?.trim() ?? null;
    if (body.images !== undefined) updates.images = body.images;

    const { data, error: updateError } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ error: 'Error al actualizar el evento' });
    }
    if (!data) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    if (!eventId || Number.isNaN(eventId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { data, error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .select()
      .single();

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return res.status(500).json({ error: 'Error al eliminar el evento' });
    }
    if (!data) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    return res.status(200).json({ message: 'Evento eliminado', id: eventId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
