import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AdminSession =
  | { status: 'unconfigured' }
  | { status: 'unauthenticated' }
  | { status: 'forbidden'; email: string | null }
  | { status: 'authorized'; email: string | null; role: 'admin' | 'editor'; displayName: string | null };

export async function getAdminSession(): Promise<AdminSession> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { status: 'unconfigured' };

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { status: 'unauthenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return { status: 'forbidden', email: user.email ?? null };
  }

  return {
    status: 'authorized',
    email: user.email ?? null,
    role: profile.role as 'admin' | 'editor',
    displayName: profile.display_name,
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.status === 'unauthenticated') redirect('/admin/connexion');
  return session;
}
