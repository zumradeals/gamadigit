'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Network, UsersRound } from 'lucide-react';

type InvitePayload = {
  ok?: boolean;
  error?: string;
  canAccept?: boolean;
  expiresAt?: string;
  group?: {
    id: string;
    name: string;
    sector: string;
    objective: string;
    participationMode: string;
    country: string | null;
    city: string | null;
    status: string;
  };
};

export function ZumraInviteAccept({ token }: { token: string }) {
  const router = useRouter();
  const [data, setData] = useState<InvitePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const response = await fetch(`/api/zumra/invites/${encodeURIComponent(token)}`, { cache: 'no-store' }).catch(() => null);
    if (!response) {
      setError('Impossible de verifier cette invitation.');
      setLoading(false);
      return;
    }
    if (response.status === 401) {
      window.location.href = `/connexion?next=${encodeURIComponent(`/espace/zumra/rejoindre/${token}`)}`;
      return;
    }
    const body = await response.json().catch(() => ({})) as InvitePayload;
    if (!response.ok || !body.ok || !body.group) {
      setError(messageFor(body.error));
      setLoading(false);
      return;
    }
    setData(body);
    setLoading(false);
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  async function accept() {
    setJoining(true);
    setError('');
    const response = await fetch(`/api/zumra/invites/${encodeURIComponent(token)}`, { method: 'POST' }).catch(() => null);
    const body = response ? await response.json().catch(() => ({})) as { ok?: boolean; groupId?: string; error?: string } : {};
    if (!response || !response.ok || !body.ok || !body.groupId) {
      setError(messageFor(body.error));
      setJoining(false);
      return;
    }
    router.push(`/espace/zumra/reseau/${body.groupId}`);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="flex items-center gap-3 font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Verification de l’invitation…</div></main>;
  }

  if (!data?.group) {
    return <main className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-3xl"><Link href="/espace" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Mon espace</Link><div className="mt-7 rounded-[2rem] border border-red-200 bg-red-50 p-8"><h1 className="text-2xl font-black text-dgNavy">Invitation indisponible</h1><p className="mt-3 leading-7 text-red-800">{error || 'Ce lien n’est plus utilisable.'}</p></div></div></main>;
  }

  const group = data.group;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Mon espace</Link>
        <section className="mt-7 overflow-hidden rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><Network className="h-6 w-6" /></div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Invitation ZUMRA</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em]">{group.name}</h1>
          <p className="mt-3 font-bold text-slate-300">{group.sector} · {modeLabel(group.participationMode)}</p>
          <p className="mt-6 text-lg leading-8 text-slate-300">{group.objective}</p>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">{error}</div>}

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
          <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><UsersRound className="h-5 w-5" /></div><div><h2 className="text-2xl font-black text-dgNavy">Rejoindre cette Zumra</h2><p className="mt-2 leading-7 text-slate-600">En acceptant, vous devenez membre actif de ce groupe de travail. Une fonction fondatrice pourra ensuite vous etre attribuee par le responsable principal.</p></div></div>
          {data.canAccept ? <button onClick={accept} disabled={joining} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dgGreen px-5 py-4 text-sm font-black text-white disabled:opacity-60">{joining && <Loader2 className="h-4 w-4 animate-spin" />} Accepter et rejoindre la Zumra</button> : <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-6 text-amber-900">Votre adhesion au Programme ZUMRA doit etre active avant de rejoindre un groupe. <Link href="/espace/zumra" className="underline">Voir mon dossier d’adhesion</Link>.</div>}
        </section>
      </div>
    </main>
  );
}

function modeLabel(mode: string) {
  if (mode === 'digital') return '100 % numerique';
  if (mode === 'physical') return 'Physique';
  return 'Hybride';
}

function messageFor(code?: string) {
  const messages: Record<string, string> = {
    INVITATION_INVALIDE: 'Cette invitation a deja ete utilisee, revoquee ou n’existe pas.',
    INVITATION_EXPIREE: 'Cette invitation a expire. Demandez un nouveau lien au responsable principal.',
    ADHESION_NON_ACTIVE: 'Votre adhesion ZUMRA doit etre active avant de rejoindre une Zumra.',
  };
  return messages[code || ''] || 'Cette invitation ne peut pas etre utilisee pour le moment.';
}
