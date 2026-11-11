import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let publicClient: SupabaseClient | null | undefined;

export function createSupabasePublicClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (publicClient === undefined) {
    publicClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return publicClient;
}
