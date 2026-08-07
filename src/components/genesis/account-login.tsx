'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, Loader2, ShieldCheck, UserRound } from 'lucide-react';

export function AccountLogin() {
  const router = useRouter();
  const [entity, setEntity] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/genesis/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity, secret }),
      });
      const body = await response.json();

      if (!response.ok || !body.ok) {
        setError(body.error === 'IDENTIFIANT_OU_SECRET_REFUSE'
          ? 'Identifiant GAMAD ou secret refusé.'
          : 'Connexion au GAMAD Core temporairement indisponible.');
        return;
      }

      router.push('/genesis/espace');
      router.refresh();
    } catch {
      setError('Connexion temporairement indisponible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <Link href="/genesis" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy">
          <ArrowLeft className="h-4 w-4" /> Retour au portail
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="bg-dgNavy px-7 py-8 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-dgGold">
              <UserRound className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Compte GAMAD</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">Mon espace</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">Une seule identité canonique pour accéder progressivement aux services de l’écosystème.</p>
          </div>

          <form onSubmit={submit} className="space-y-5 p-7">
            <div>
              <label className="text-sm font-black text-slate-800">Identifiant GAMAD</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy">
                <UserRound className="h-5 w-5 text-slate-400" />
                <input
                  value={entity}
                  onChange={(event) => setEntity(event.target.value)}
                  autoComplete="username"
                  placeholder="IDN-… ou référence de votre identité"
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-black text-slate-800">Secret</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy">
                <KeyRound className="h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Votre secret GAMAD"
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none"
                  required
                />
              </div>
            </div>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {loading ? 'Connexion au Core…' : 'Se connecter avec GAMAD'}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">Le portail ne conserve pas votre secret. L’authentification est vérifiée directement par le GAMAD Core.</p>
          </form>
        </div>
      </div>
    </main>
  );
}
