import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = process.env['VITE_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_KEY'];

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ ok: false, error: 'Missing env vars' });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { error } = await supabase
    .from('projects')
    .select('count', { count: 'exact', head: true });

  if (error) {
    return res.status(503).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true });
}
