// src/services/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

try {
  if (!url || !anon) {
    console.warn('[supabaseClient] Missing envs: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  } else {
    supabase = createClient(url, anon);
  }
} catch (e) {
  console.error('[supabaseClient] Failed to create client', e);
  supabase = null;
}

export { supabase };

// Optional: expose for console testing & confirm execution
if (typeof window !== 'undefined') {
  (window as any)._supabase = supabase;
  console.log('[supabaseClient] ready. url?', !!url, 'anon?', !!anon, 'client?', !!supabase);
}
