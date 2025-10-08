// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);

// Expose for console debugging
if (typeof window !== 'undefined') {
  (window as any)._supabase = supabase;
  // optional debug:
  // console.log('Supabase client ready:', !!url, !!anon);
}
