import type { SupabaseClient } from '@supabase/supabase-js';

let instance: SupabaseClient | null = null;

export async function getSupabase(): Promise<SupabaseClient> {
  if (!instance) {
    const { supabase } = await import('./supabase');
    instance = supabase;
  }
  return instance;
}
