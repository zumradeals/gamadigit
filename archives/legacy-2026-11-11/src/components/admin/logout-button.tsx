'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.replace('/admin/connexion');
    router.refresh();
  }

  return (
    <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">
      <LogOut className="h-4 w-4" /> Déconnexion
    </button>
  );
}
