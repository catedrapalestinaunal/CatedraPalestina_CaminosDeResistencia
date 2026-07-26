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

  if (req.method === 'GET') {
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

  return res.status(405).json({ error: 'Method not allowed' });
}
