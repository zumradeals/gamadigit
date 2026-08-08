'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Network, Plus, UsersRound } from 'lucide-react';
import type { ZumraGroupSummary, ZumraMePayload, ZumraParticipationMode } from '@/lib/zumra/types';

export function ZumraNetworkDashboard() {
  const router = useRouter();
  const [me, setMe] = useState<ZumraMePayload | null>(null);
  const [groups, setGroups] = useState<ZumraGroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [objective, setObjective] = useState('');
  const [participationMode, setParticipationMode] = useState<ZumraParticipationMode>('both');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const meResponse = await fetch('/api/zumra/me', { cache: 'no-store' });
        if (meResponse.status === 401) {
          window.location.href = '/connexion';
          return;
        }
        const meBody = await meResponse.json() as ZumraMePayload;
        setMe(meBody);
        if (!meResponse.ok || meBody.membership?.status !== 'active') return;

        const groupsResponse = await fetch('/api/zumra/groups', { cache: 'no-store' });
        const groupsBody = await groupsResponse.json() as { ok?: boolean; groups?: ZumraGroupSummary[]; error?: string };
        if (!groupsResponse.ok || !groupsBody.ok) throw new Error(groupsBody.error || 'ZUMRA_INDISPONIBLE');
        setGroups(groupsBody.groups ?? []);
      } catch {
        setError('Le reseau ZUMRA est momentanement indisponible.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function createGroup(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const response = await fetch('/api/zumra/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, sector, objective, participationMode, country, city }),
    }).catch(() => null);

    if (!response) {
      setError('Impossible de joindre le service. Reessayez.');
      setSaving(false);
      return;
    }

    const body = await response.json().catch(() => ({})) as { ok?: boolean; groupId?: string; error?: string };
    if (!response.ok || !body.ok || !body.groupId) {
      setError(messageFor(body.error));
      setSaving(false);
      return;
    }

    router.push(`/espace/zumra/reseau/${body.groupId}`);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="flex items-center gap-3 font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Chargement du reseau ZUMRA…</div></main>;
  }

  if (me?.membership?.status !== 'active') {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Retour a Mon espace</Link>
          <section className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-8 sm:p-10">
            <Network className="h-10 w-10 text-amber-700" />
            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-amber-700">Reseau ZUMRA</p>
            <h1 className="mt-3 text-3xl font-black text-dgNavy">Votre adhesion doit d’abord etre active.</h1>
            <p className="mt-4 leading-7 text-slate-600">La creation et l’integration d’une Zumra sont reservees aux membres actifs du Programme ZUMRA. Votre profil peut deja etre prepare pendant que le paiement d’adhesion est en cours de branchement.</p>
            <Link href="/espace/zumra" className="mt-6 inline-flex rounded-xl bg-dgNavy px-5 py-3 text-sm font-black text-white">Voir mon dossier d’adhesion</Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Mon espace</Link>
          <Link href="/espace/zumra" className="text-sm font-black text-dgGreen">Modifier mon profil ZUMRA</Link>
        </div>

        <section className="mt-7 overflow-hidden rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><Network className="h-7 w-7" /></div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Reseau ZUMRA</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Former une equipe. Apprendre. Construire.</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">Une nouvelle Zumra commence en formation. Elle devient active lorsqu’au moins 5 membres sont reunis et que les 5 responsabilites fondatrices sont attribuees.</p>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">{error}</div>}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mes Zumra</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Vos groupes de travail</h2></div><UsersRound className="h-7 w-7 text-dgGreen" /></div>
            {groups.length === 0 ? (
              <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6"><p className="font-black text-slate-700">Vous n’appartenez encore a aucune Zumra.</p><p className="mt-2 text-sm leading-6 text-slate-500">Vous pouvez creer la premiere, ou rejoindre une Zumra avec un lien d’invitation envoye par son responsable principal.</p></div>
            ) : (
              <div className="mt-6 space-y-4">{groups.map((group) => <GroupCard key={group.id} group={group} />)}</div>
            )}
          </div>

          <form onSubmit={createGroup} className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Plus className="h-5 w-5" /></div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Creer une Zumra</p>
            <h2 className="mt-3 text-2xl font-black text-dgNavy">Vous devenez responsable principal.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Ce role pourra ensuite etre transfere a un autre membre actif.</p>

            <div className="mt-6 space-y-4">
              <Field label="Nom de la Zumra *" value={name} onChange={setName} placeholder="Ex. Batiment Abidjan Nord" />
              <Field label="Secteur d’activite *" value={sector} onChange={setSector} placeholder="Batiment, agriculture, numerique…" />
              <label className="block text-sm font-black text-slate-700">Objectif commun *<textarea required minLength={10} rows={4} value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Que voulez-vous apprendre, realiser ou developper ensemble ?" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-dgGreen" /></label>
              <label className="block text-sm font-black text-slate-700">Mode<select value={participationMode} onChange={(event) => setParticipationMode(event.target.value as ZumraParticipationMode)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none focus:border-dgGreen"><option value="physical">Physique</option><option value="digital">100 % numerique</option><option value="both">Hybride</option></select></label>
              {participationMode !== 'digital' && <div className="grid gap-4 sm:grid-cols-2"><Field label="Pays *" value={country} onChange={setCountry} /><Field label="Ville / Localite *" value={city} onChange={setCity} /></div>}
            </div>

            <button disabled={saving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dgGreen px-5 py-4 text-sm font-black text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Creer ma Zumra</button>
          </form>
        </section>
      </div>
    </main>
  );
}

function GroupCard({ group }: { group: ZumraGroupSummary }) {
  const memberProgress = Math.min(100, (group.activeMembers / group.requiredMembers) * 100);
  const roleProgress = Math.min(100, (group.rolesFilled / group.requiredRoles) * 100);
  return <Link href={`/espace/zumra/reseau/${group.id}`} className="block rounded-2xl border border-slate-200 p-5 transition hover:border-dgGreen/40 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black text-dgNavy">{group.name}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${group.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{group.status === 'active' ? 'Active' : 'En formation'}</span></div><p className="mt-1 text-sm font-bold text-slate-500">{group.sector} · {modeLabel(group.participationMode)}</p></div><ArrowRight className="h-5 w-5 shrink-0 text-slate-400" /></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{group.objective}</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Progress label="Membres" value={`${group.activeMembers}/5`} percent={memberProgress} /><Progress label="Responsabilites" value={`${group.rolesFilled}/5`} percent={roleProgress} /></div>{group.currentRole && <p className="mt-4 text-xs font-bold text-dgGreen">Votre role : {roleLabel(group.currentRole)}</p>}</Link>;
}

function Progress({ label, value, percent }: { label: string; value: string; percent: number }) {
  return <div><div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>{label}</span><span>{value}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-dgGreen" style={{ width: `${percent}%` }} /></div></div>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block text-sm font-black text-slate-700">{label}<input required={label.includes('*')} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-dgGreen" /></label>;
}

function modeLabel(mode: ZumraParticipationMode) {
  if (mode === 'digital') return 'Numerique';
  if (mode === 'physical') return 'Physique';
  return 'Hybride';
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    principal: 'Responsable principal',
    deputy_1: 'Responsable adjoint 1',
    deputy_2: 'Responsable adjoint 2',
    finance: 'Responsable financier',
    social: 'Responsable des affaires sociales',
  };
  return labels[role] || role;
}

function messageFor(code?: string) {
  const messages: Record<string, string> = {
    ADHESION_NON_ACTIVE: 'Votre adhesion ZUMRA doit etre active avant de creer une Zumra.',
    LOCALISATION_REQUISE: 'Indiquez le pays et la ville pour une Zumra physique ou hybride.',
    FORMULAIRE_INVALIDE: 'Verifiez le nom, le secteur, l’objectif et le mode de participation.',
  };
  return messages[code || ''] || 'La Zumra n’a pas pu etre creee. Reessayez.';
}
