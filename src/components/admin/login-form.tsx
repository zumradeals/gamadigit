'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LockKeyhole } from 'lucide-react';
import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError('Supabase doit être configuré avant la première connexion.');
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Adresse e-mail ou mot de passe incorrect.');
      setLoading(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  const inputClass = 'focus-ring w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-white placeholder:text-slate-500';

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-200">E-mail administrateur</label>
        <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} autoComplete="email" required />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-200">Mot de passe</label>
        <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} autoComplete="current-password" required />
      </div>
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading || !isSupabaseConfigured()} className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-4 font-black text-ink disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LockKeyhole className="h-5 w-5" />}
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
