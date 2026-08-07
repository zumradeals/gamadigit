'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, CircleUserRound, Loader2, LogOut, ShieldCheck } from 'lucide-react';

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
    () => text(identity.denomination) || text(identity.nom) || text(identity.libelle) || data?.account?.entity || 'Compte GAMAD',
    [identity, data],
  );
  const type = text(identity.type) || text(identity.type_entite) || 'Identité canonique';
  const state = text(identity.etat) || text(identity.statut) || 'Reconnu par le Core';
  const visibility = text(identity.visibilite) || text(identity.regime_visibilite);

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/genesis/account/logout', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/genesis';
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Vérification du Compte GAMAD…</div>
      </main>
    );
  }

  if (!data?.authenticated || !data.account) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 text-center">
        <p className="font-black text-dgNavy">Session indisponible.</p>
        <Link href="/genesis/connexion" className="mt-4 inline-block text-sm font-bold underline">Se reconnecter</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/genesis" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Retour au portail</Link>
          <button onClick={logout} disabled={loggingOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 disabled:opacity-60">
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Déconnexion
          </button>
        </div>

        <section className="mt-8 overflow-hidden rounded-[2rem] bg-dgNavy text-white shadow-xl shadow-slate-300/40">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><CircleUserRound className="h-7 w-7" /></div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mon espace · Compte GAMAD</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{displayName}</h1>
              <p className="mt-4 max-w-2xl text-slate-300">Votre identité est lue directement depuis le GAMAD Core. Le portail ne crée pas de profil d’identité parallèle.</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-sm font-black text-emerald-100">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Session Core active</span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Référence canonique" value={data.account.entity} />
          <InfoCard label="Type" value={type} />
          <InfoCard label="État" value={state} />
          <InfoCard label="Assurance" value={data.account.assurance || 'Non précisée'} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Identité canonique</p>
            <h2 className="mt-3 text-2xl font-black text-dgNavy">Ce que le portail connaît de vous</h2>
            <div className="mt-7 divide-y divide-slate-100">
              <Row label="Nom affiché" value={displayName} />
              <Row label="Référence" value={data.account.entity} />
              <Row label="Type" value={type} />
              <Row label="État" value={state} />
              {visibility && <Row label="Visibilité" value={visibility} />}
              <Row label="Session valable jusqu’au" value={new Date(data.account.expiresAt).toLocaleString('fr-FR')} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-dgNavy"><Building2 className="h-6 w-6" /></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Prochaine couche</p>
            <h2 className="mt-3 text-2xl font-black text-dgNavy">Organisations & services</h2>
            <p className="mt-4 leading-7 text-slate-600">Les organisations, mandats, produits accessibles et satellites apparaîtront ici à mesure que leurs contrats Core seront branchés au portail.</p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">CAP-PORTAL-003 établit d’abord la session et l’identité. Aucun droit n’est inventé côté portail.</div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-2 break-words text-sm font-black text-dgNavy">{value}</p></div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:gap-4"><span className="text-sm font-bold text-slate-400">{label}</span><span className="break-words text-sm font-black text-slate-800">{value}</span></div>;
}
