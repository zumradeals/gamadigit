'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CircleUserRound, CreditCard, ExternalLink, Loader2, LogOut, Network, Settings, Sparkles } from 'lucide-react';
import type { ZumraMePayload } from '@/lib/zumra/types';

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
  const [zumra, setZumra] = useState<ZumraMePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/genesis/account/me', { cache: 'no-store' })
      .then(async (response) => {
        const body = (await response.json()) as AccountPayload;
        if (!response.ok || !body.authenticated) {
          window.location.href = '/connexion';
          return;
        }
        setData(body);
        fetch('/api/zumra/me', { cache: 'no-store' })
          .then(async (zumraResponse) => {
            if (!zumraResponse.ok) return null;
            return zumraResponse.json() as Promise<ZumraMePayload>;
          })
          .then((zumraBody) => { if (zumraBody) setZumra(zumraBody); })
          .catch(() => undefined);
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
    window.location.href = '/';
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="flex items-center gap-3 text-sm font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Chargement de votre espace…</div></main>;
  }

  if (!data?.authenticated || !data.account) {
    return <main className="min-h-screen bg-slate-50 px-4 py-16 text-center"><p className="font-black text-dgNavy">Votre session n’est plus disponible.</p><Link href="/connexion" className="mt-4 inline-block text-sm font-bold underline">Se reconnecter</Link></main>;
  }

  const userId = data.account.entity;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Retour a DG AFRIQUE</Link><button onClick={logout} disabled={loggingOut} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 disabled:opacity-60">{loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Deconnexion</button></div>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-dgNavy text-white shadow-xl shadow-slate-300/40"><div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-dgGold/10 blur-3xl" /><div className="relative p-8 sm:p-10 lg:p-12"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><CircleUserRound className="h-7 w-7" /></div><p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mon espace</p><h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Bonjour, {displayName}</h1><p className="mt-4 max-w-2xl text-slate-300">Votre identite, vos services et votre parcours ZUMRA au meme endroit.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 md:min-w-52"><p className="text-xs font-black uppercase tracking-[0.15em] text-dgGold">Mon ID</p><p className="mt-2 break-all text-xl font-black sm:text-2xl">{userId}</p></div></div></div></section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mon profil</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Informations essentielles</h2><div className="mt-7 divide-y divide-slate-100"><Row label="Nom" value={displayName} /><Row label="Mon ID" value={userId} /><Row label="Compte" value="Actif" /></div></div>
          <ZumraPanel data={zumra} displayName={displayName} userId={userId} />
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mes services</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Vos acces apparaissent ici</h2></div><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Sparkles className="h-6 w-6" /></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="font-black text-dgNavy">DG AFRIQUE</p><p className="mt-1 text-sm leading-6 text-slate-500">Services numeriques, formations et opportunites.</p><Link href="/pole-numerique" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-dgGreen">Explorer <ExternalLink className="h-4 w-4" /></Link></div><div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"><div className="flex items-start gap-3"><Settings className="mt-0.5 h-5 w-5 shrink-0 text-slate-400"/><div><p className="font-black text-slate-700">D’autres services viendront progressivement</p><p className="mt-1 text-sm leading-6 text-slate-500">Ils seront relies a la meme identite sans multiplier les comptes.</p></div></div></div></div></section>
      </div>
    </main>
  );
}

function ZumraPanel({ data, displayName, userId }: { data: ZumraMePayload | null; displayName: string; userId: string }) {
  if (data?.enrolled && data.membership?.status === 'active') {
    return <div className="overflow-hidden rounded-[2rem] border border-dgGold/30 bg-dgNavy p-7 text-white sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Ma Carte ZUMRA</p><h2 className="mt-3 text-2xl font-black">{displayName}</h2></div><CreditCard className="h-8 w-8 text-dgGold" /></div><div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">ID membre</p><p className="mt-2 break-all font-black">{userId}</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><CardInfo label="Pays" value={data.profile?.country || '—'} /><CardInfo label="Statut" value="Membre actif" /><CardInfo label="Zumra" value="Aucune pour le moment" /><CardInfo label="Contribution" value={contributionLabel(data.membership.contributionStatus)} /></div></div><div className="mt-5 flex flex-wrap gap-3"><Link href="/espace/zumra" className="rounded-xl bg-dgGold px-4 py-3 text-sm font-black text-dgNavy">Mon profil ZUMRA</Link><span className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-slate-300">Carte physique : prochaine etape</span></div></div>;
  }

  if (data?.enrolled && data.membership?.status === 'pending_payment') {
    return <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-7 sm:p-8"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-700"><Network className="h-6 w-6" /></div><p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-amber-700">Programme ZUMRA</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Adhesion en cours</h2><p className="mt-3 leading-7 text-slate-600">Votre profil est enregistre. L’activation de la Carte ZUMRA interviendra apres le paiement de l’adhesion lorsque ce moyen sera branche.</p><Link href="/espace/zumra" className="mt-5 inline-flex rounded-xl bg-dgNavy px-4 py-3 text-sm font-black text-white">Voir mon dossier ZUMRA</Link></div>;
  }

  return <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Network className="h-6 w-6" /></div><p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Programme ZUMRA</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Apprendre · Transmettre · Agir</h2><p className="mt-3 leading-7 text-slate-600">Rejoignez un reseau ou le diplome n’est pas une condition d’entree. Vous pouvez apporter un savoir-faire, apprendre a partir de zero, rejoindre ou creer une Zumra.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/espace/zumra" className="rounded-xl bg-dgGreen px-4 py-3 text-sm font-black text-white">Rejoindre le programme</Link><Link href="/programme-zumra" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-dgNavy">Decouvrir ZUMRA</Link></div></div>;
}

function contributionLabel(status: string) {
  if (status === 'up_to_date') return 'A jour';
  if (status === 'grace') return 'Periode de grace';
  if (status === 'late') return 'En retard';
  return 'Non demarree';
}

function CardInfo({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-1 text-sm font-black">{value}</p></div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr] sm:gap-4"><span className="text-sm font-bold text-slate-400">{label}</span><span className="break-words text-sm font-black text-slate-800">{value}</span></div>;
}
