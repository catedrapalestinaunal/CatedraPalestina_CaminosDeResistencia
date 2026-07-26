import type { VercelRequest } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

export const VALID_KINDS = [
  'ensayo', 'cartografia', 'video', 'podcast',
  'fanzine', 'mural', 'collage', 'grabado', 'otro',
] as const;

export function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Variable de entorno faltante: ${name}`);
  }
  return val;
}

export async function getAuthenticatedUser(req: VercelRequest): Promise<User> {
  const supabaseUrl = requireEnv('VITE_SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SERVICE_KEY');

  const supabase = createClient(supabaseUrl, serviceKey);

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    throw new Error('No autorizado');
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('No autorizado');
  }

  return user;
}
