'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CircleUserRound, Loader2, LogOut, Settings, Sparkles } from 'lucide-react';

type AccountPayload = {
  authenticated: boolean;
  account?: {
    entity: string;
    assurance: string | null;
    expiresAt: string;
    identity: Record<string, unknown>;
  };
};

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

function publicUserId(entity: string) {
  const suffix = entity.match(/(\d+)$/)?.[1];
  return suffix ? `DG-${suffix}` : `DG-${entity.slice(-8).toUpperCase()}`;
}

export function AccountSpace() {
  const [data, setData] = useState<AccountPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/genesis/account/me', { cache: 'no-store' })
      .then(async (response) => {
        const body = (await response.json()) as AccountPayload;
        if (!response.ok || !body.authenticated) {
          window.location.href = '/genesis/connexion';
          return;
        }
        setData(body);
      })
      .catch(() => setData({ authenticated: false }))
      .finally(() => setLoading(false));
  }, []);

  const identity = data?.account?.identity ?? {};
  const displayName = useMemo(
    () => text(identity.denomination) || text(identity.nom) || text(identity.libelle) || 'Utilisateur',
    [identity],
  );

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/genesis/account/logout', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/genesis';
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Chargement de votre espace…</div>
      </main>
    );
  }

  if (!data?.authenticated || !data.account) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 text-center">
        <p className="font-black text-dgNavy">Votre session n’est plus disponible.</p>
        <Link href="/genesis/connexion" className="mt-4 inline-block text-sm font-bold underline">Se reconnecter</Link>
      </main>
    );
  }

  const userId = publicUserId(data.account.entity);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/genesis" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Retour au portail</Link>
          <button onClick={logout} disabled={loggingOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 disabled:opacity-60">
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Déconnexion
          </button>
        </div>

        <section className="mt-8 overflow-hidden rounded-[2rem] bg-dgNavy text-white shadow-xl shadow-slate-300/40">
          <div className="p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><CircleUserRound className="h-7 w-7" /></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mon espace</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Bonjour, {displayName}</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Retrouvez ici vos informations et, progressivement, les services qui vous sont accessibles.</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Votre compte</p>
            <h2 className="mt-3 text-2xl font-black text-dgNavy">Informations personnelles</h2>
            <div className="mt-7 divide-y divide-slate-100">
              <Row label="Nom" value={displayName} />
              <Row label="ID utilisateur" value={userId} />
              <Row label="Statut" value="Actif" />
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-400">Votre ID utilisateur permet de vous reconnaître de façon unique sur le portail.</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-dgNavy"><Sparkles className="h-6 w-6" /></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mes services</p>
            <h2 className="mt-3 text-2xl font-black text-dgNavy">Votre espace évolue avec vous</h2>
            <p className="mt-4 leading-7 text-slate-600">Vos services, organisations et accès apparaîtront ici lorsqu’ils seront disponibles pour votre compte.</p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
              <Settings className="h-5 w-5 shrink-0" /> Aucun service supplémentaire à afficher pour le moment.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 py-4 sm:grid-cols-[150px_1fr] sm:gap-4"><span className="text-sm font-bold text-slate-400">{label}</span><span className="break-words text-sm font-black text-slate-800">{value}</span></div>;
}
