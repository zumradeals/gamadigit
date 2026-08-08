'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Link2, Loader2, Network, ShieldCheck, UsersRound } from 'lucide-react';
import {
  ZUMRA_FOUNDING_ROLE_LABELS,
  type ZumraFoundingRole,
  type ZumraGroupDetail,
  type ZumraGroupMember,
} from '@/lib/zumra/types';

type DetailPayload = ZumraGroupDetail & { ok: boolean; error?: string };

export function ZumraGroupDashboard({ groupId }: { groupId: string }) {
  const [detail, setDetail] = useState<ZumraGroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [principalTarget, setPrincipalTarget] = useState('');

  const load = useCallback(async () => {
    const response = await fetch(`/api/zumra/groups/${groupId}`, { cache: 'no-store' }).catch(() => null);
    if (!response) {
      setError('Impossible de joindre le reseau ZUMRA.');
      setLoading(false);
      return;
    }
    if (response.status === 401) {
      window.location.href = '/connexion';
      return;
    }
    const body = await response.json().catch(() => ({})) as DetailPayload;
    if (!response.ok || !body.ok) {
      setError(messageFor(body.error));
      setLoading(false);
      return;
    }
    setDetail({ group: body.group, members: body.members, roles: body.roles, canManage: body.canManage });
    setError('');
    setLoading(false);
  }, [groupId]);

  useEffect(() => { void load(); }, [load]);

  const ordinaryMembers = useMemo(
    () => detail?.members.filter((member) => member.role === null) ?? [],
    [detail],
  );

  async function createInvite() {
    setWorking('invite');
    setError('');
    const response = await fetch(`/api/zumra/groups/${groupId}/invites`, { method: 'POST' }).catch(() => null);
    if (!response) {
      setError('Impossible de creer le lien d’invitation.');
      setWorking('');
      return;
    }
    const body = await response.json().catch(() => ({})) as { ok?: boolean; token?: string; error?: string };
    if (!response.ok || !body.ok || !body.token) {
      setError(messageFor(body.error));
      setWorking('');
      return;
    }
    setInviteUrl(`${window.location.origin}/espace/zumra/rejoindre/${body.token}`);
    setCopied(false);
    setWorking('');
  }

  async function copyInvite() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function assignRole(role: Exclude<ZumraFoundingRole, 'principal'>, targetIdentity: string) {
    if (!targetIdentity) return;
    setWorking(role);
    setError('');
    const response = await fetch(`/api/zumra/groups/${groupId}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, targetIdentity }),
    }).catch(() => null);
    const body = response ? await response.json().catch(() => ({})) as { ok?: boolean; error?: string } : {};
    if (!response || !response.ok || !body.ok) {
      setError(messageFor(body.error));
      setWorking('');
      return;
    }
    await load();
    setWorking('');
  }

  async function transferPrincipal() {
    if (!principalTarget) return;
    setWorking('principal');
    setError('');
    const response = await fetch(`/api/zumra/groups/${groupId}/principal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetIdentity: principalTarget }),
    }).catch(() => null);
    const body = response ? await response.json().catch(() => ({})) as { ok?: boolean; error?: string } : {};
    if (!response || !response.ok || !body.ok) {
      setError(messageFor(body.error));
      setWorking('');
      return;
    }
    setPrincipalTarget('');
    await load();
    setWorking('');
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="flex items-center gap-3 font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Chargement de la Zumra…</div></main>;
  }

  if (!detail) {
    return <main className="min-h-screen bg-slate-50 px-4 py-12"><div className="mx-auto max-w-3xl"><Link href="/espace/zumra/reseau" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Reseau ZUMRA</Link><div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 font-bold text-red-800">{error || 'Cette Zumra n’est pas disponible.'}</div></div></main>;
  }

  const { group, members, roles, canManage } = detail;
  const memberPercent = Math.min(100, (group.activeMembers / 5) * 100);
  const rolePercent = Math.min(100, (group.rolesFilled / 5) * 100);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/espace/zumra/reseau" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Toutes mes Zumra</Link>

        <section className="relative mt-7 overflow-hidden rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-dgGold/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">{group.status === 'active' ? 'Zumra active' : 'Zumra en formation'}</p><h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{group.name}</h1><p className="mt-3 font-bold text-slate-300">{group.sector} · {modeLabel(group.participationMode)}{group.city ? ` · ${group.city}` : ''}{group.country ? `, ${group.country}` : ''}</p></div><div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${group.status === 'active' ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-200'}`}>{group.status === 'active' ? 'Active' : 'Formation'}</div></div>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{group.objective}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2"><HeroProgress label="Membres actifs" value={`${group.activeMembers}/5 minimum`} percent={memberPercent} /><HeroProgress label="Responsabilites fondatrices" value={`${group.rolesFilled}/5`} percent={rolePercent} /></div>
            {group.status === 'active' && <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-200"><ShieldCheck className="h-5 w-5" /> Les conditions fondatrices sont remplies.</div>}
          </div>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">{error}</div>}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Equipe fondatrice</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Les 5 responsabilites</h2></div><UsersRound className="h-7 w-7 text-dgGreen" /></div>
            <p className="mt-3 text-sm leading-6 text-slate-500">Les cinq fonctions sont occupees par cinq personnes distinctes. Les autres membres peuvent rejoindre la Zumra sans fonction fondatrice.</p>
            <div className="mt-6 space-y-3">{roles.map((assignment) => <RoleCard key={assignment.role} assignment={assignment} members={members} canManage={canManage} working={working} onAssign={assignRole} />)}</div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Link2 className="h-5 w-5" /></div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Recrutement</p>
              <h2 className="mt-3 text-2xl font-black text-dgNavy">Inviter un membre</h2>
              {canManage ? <><p className="mt-3 text-sm leading-6 text-slate-500">Generez un lien valable 7 jours. Il est utilisable une seule fois par un membre ZUMRA actif.</p><button onClick={createInvite} disabled={working === 'invite'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dgGreen px-4 py-3 text-sm font-black text-white disabled:opacity-60">{working === 'invite' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />} Creer un lien d’invitation</button>{inviteUrl && <div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="break-all text-xs font-bold text-slate-600">{inviteUrl}</p><button onClick={copyInvite} className="mt-3 inline-flex items-center gap-2 text-sm font-black text-dgGreen">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copie' : 'Copier le lien'}</button></div>}</> : <p className="mt-3 text-sm leading-6 text-slate-500">Seul le responsable principal peut generer les invitations dans cette premiere version.</p>}
            </section>

            {canManage && <section className="rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Responsabilite principale</p><h2 className="mt-3 text-xl font-black text-dgNavy">Transferer mon role</h2><p className="mt-3 text-sm leading-6 text-slate-500">Le membre choisi devient responsable principal. Il doit etre membre actif et ne pas deja occuper une autre fonction fondatrice.</p><select value={principalTarget} onChange={(event) => setPrincipalTarget(event.target.value)} className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-dgGreen"><option value="">Choisir un membre</option>{ordinaryMembers.map((member) => <option key={member.coreIdentityReference} value={member.coreIdentityReference}>{member.displayName}</option>)}</select><button onClick={transferPrincipal} disabled={!principalTarget || working === 'principal'} className="mt-3 w-full rounded-xl border border-dgNavy px-4 py-3 text-sm font-black text-dgNavy disabled:opacity-50">{working === 'principal' ? 'Transfert…' : 'Transferer la responsabilite'}</button></section>}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Membres</p><h2 className="mt-3 text-2xl font-black text-dgNavy">{members.length} membre{members.length > 1 ? 's' : ''} actif{members.length > 1 ? 's' : ''}</h2></div><Network className="h-7 w-7 text-slate-400" /></div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">{members.map((member) => <MemberCard key={member.coreIdentityReference} member={member} />)}</div>
        </section>
      </div>
    </main>
  );
}

function RoleCard({ assignment, members, canManage, working, onAssign }: {
  assignment: ZumraGroupDetail['roles'][number];
  members: ZumraGroupMember[];
  canManage: boolean;
  working: string;
  onAssign: (role: Exclude<ZumraFoundingRole, 'principal'>, targetIdentity: string) => Promise<void>;
}) {
  const eligible = members.filter((member) => member.role === null || member.role === assignment.role);
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-black text-dgNavy">{assignment.label}</p><p className="mt-1 text-sm text-slate-500">{assignment.displayName || 'Fonction a pourvoir'}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${assignment.coreIdentityReference ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>{assignment.coreIdentityReference ? 'Attribuee' : 'Libre'}</span></div>{canManage && assignment.role !== 'principal' && <div className="mt-4 flex gap-2"><select defaultValue={assignment.coreIdentityReference || ''} onChange={(event) => { if (event.target.value) void onAssign(assignment.role as Exclude<ZumraFoundingRole, 'principal'>, event.target.value); }} disabled={working === assignment.role} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-dgGreen disabled:opacity-60"><option value="">Choisir un membre</option>{eligible.map((member) => <option key={member.coreIdentityReference} value={member.coreIdentityReference}>{member.displayName}</option>)}</select>{working === assignment.role && <Loader2 className="mt-2.5 h-4 w-4 animate-spin text-dgGreen" />}</div>}</div>;
}

function MemberCard({ member }: { member: ZumraGroupMember }) {
  return <div className="rounded-2xl border border-slate-200 p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-dgNavy">{member.displayName}</p><p className="mt-1 break-all text-xs font-bold text-slate-400">{member.coreIdentityReference}</p></div>{member.role && <span className="rounded-full bg-dgIvory px-2.5 py-1 text-[10px] font-black text-dgNavy">{ZUMRA_FOUNDING_ROLE_LABELS[member.role]}</span>}</div>{(member.city || member.country) && <p className="mt-3 text-sm text-slate-500">{[member.city, member.country].filter(Boolean).join(', ')}</p>}{member.sectors.length > 0 && <p className="mt-2 text-xs font-bold text-dgGreen">{member.sectors.slice(0, 3).join(' · ')}</p>}</div>;
}

function HeroProgress({ label, value, percent }: { label: string; value: string; percent: number }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="flex items-center justify-between gap-4 text-sm font-black"><span>{label}</span><span className="text-dgGold">{value}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-dgGold" style={{ width: `${percent}%` }} /></div></div>;
}

function modeLabel(mode: string) {
  if (mode === 'digital') return '100 % numerique';
  if (mode === 'physical') return 'Physique';
  return 'Hybride';
}

function messageFor(code?: string) {
  const messages: Record<string, string> = {
    ACCES_ZUMRA_REFUSE: 'Vous n’etes pas membre de cette Zumra.',
    RESPONSABLE_PRINCIPAL_REQUIS: 'Cette action est reservee au responsable principal.',
    MEMBRE_DEJA_ROLE_FONDATEUR: 'Ce membre occupe deja une fonction fondatrice. Choisissez un membre sans fonction ou reattribuez d’abord son role actuel.',
    MEMBRE_INACTIF: 'Le membre choisi n’est pas actif dans cette Zumra.',
    ADHESION_NON_ACTIVE: 'Votre adhesion ZUMRA doit etre active pour cette action.',
    ZUMRA_INTROUVABLE: 'Cette Zumra n’existe pas ou n’est plus disponible.',
  };
  return messages[code || ''] || 'L’action n’a pas pu etre effectuee. Reessayez.';
}
