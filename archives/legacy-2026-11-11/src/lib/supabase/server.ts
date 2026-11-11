import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Les cookies peuvent être en lecture seule dans certains Server Components.
        }
      },
    },
  });
}
