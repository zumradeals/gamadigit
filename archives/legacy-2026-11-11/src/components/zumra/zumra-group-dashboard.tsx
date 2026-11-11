'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Link2,
  Loader2,
  MapPin,
  Network,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import {
  ZUMRA_FOUNDING_ROLE_LABELS,
  type ZumraFoundingRole,
  type ZumraGroupDetail,
  type ZumraGroupMember,
} from '@/lib/zumra/types';
import { Eyebrow, SuperButton, SuperButtonLink, SuperCard } from '@/components/superapp/ui';

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
      setError('Impossible de joindre le réseau ZUMRA.');
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
      setError('Impossible de créer le lien d’invitation.');
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-gold" /> Chargement de la Zumra…
        </div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="min-h-screen bg-paper px-4 py-12 text-ink sm:px-8">
        <div className="mx-auto max-w-3xl">
          <SuperButtonLink as={Link} href="/espace/zumra/reseau" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
            <ArrowLeft className="h-4 w-4" /> Réseau ZUMRA
          </SuperButtonLink>
          <div className="mt-6 rounded-tile border border-red-200 bg-red-50 p-6 text-body font-medium text-red-800">
            {error || 'Cette Zumra n’est pas disponible.'}
          </div>
        </div>
      </main>
    );
  }

  const { group, members, roles, canManage } = detail;
  const memberPercent = Math.min(100, (group.activeMembers / group.requiredMembers) * 100);
  const rolePercent = Math.min(100, (group.rolesFilled / group.requiredRoles) * 100);
  const membersRemaining = Math.max(0, group.requiredMembers - group.activeMembers);
  const rolesRemaining = Math.max(0, group.requiredRoles - group.rolesFilled);
  const active = group.status === 'active';

  return (
    <main className="min-h-screen bg-paper px-4 pb-20 pt-6 text-ink sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-[73.75rem]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SuperButtonLink as={Link} href="/espace/zumra/reseau" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
            <ArrowLeft className="h-4 w-4" /> Réseau ZUMRA
          </SuperButtonLink>
          <span className="text-meta text-slate-muted">Espace collectif</span>
        </div>

        <section className="overflow-hidden rounded-card border border-ink-500/40 bg-ink text-paper">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-4xl">
                <Eyebrow>{statusLabel(group.status)}</Eyebrow>
                <h1 className="mt-4 font-display text-[2.35rem] font-normal leading-[1.05] tracking-[-0.025em] sm:text-[3.2rem]">{group.name}</h1>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-ink-200">
                  <span>{group.sector}</span>
                  <span aria-hidden="true">·</span>
                  <span>{modeLabel(group.participationMode)}</span>
                  {(group.city || group.country) && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {[group.city, group.country].filter(Boolean).join(', ')}</span>
                    </>
                  )}
                </p>
                <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-ink-200">{group.objective}</p>
              </div>

              <span className={`rounded-full px-3 py-1.5 text-meta font-medium ${active ? 'bg-[#163D31] text-[#8FD3B8]' : 'bg-[#4A3B22] text-gold-400'}`}>
                {active ? 'Active' : 'En formation'}
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <HeroProgress label="Membres actifs" value={`${group.activeMembers}/${group.requiredMembers}`} percent={memberPercent} />
              <HeroProgress label="Responsabilités fondatrices" value={`${group.rolesFilled}/${group.requiredRoles}`} percent={rolePercent} />
            </div>

            {active ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-tile border border-[#285846] bg-[#163D31] px-4 py-3 text-body text-[#A7DEC8]">
                <ShieldCheck className="h-4 w-4" /> Les conditions fondatrices sont remplies.
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-2 text-meta text-ink-200">
                <span className="rounded-full border border-ink-500 px-3 py-1.5">{membersRemaining === 0 ? 'Seuil de membres atteint' : `${membersRemaining} membre${membersRemaining > 1 ? 's' : ''} encore requis`}</span>
                <span className="rounded-full border border-ink-500 px-3 py-1.5">{rolesRemaining === 0 ? '5 responsabilités attribuées' : `${rolesRemaining} responsabilité${rolesRemaining > 1 ? 's' : ''} à attribuer`}</span>
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-tile border border-red-200 bg-red-50 p-4 text-body font-medium text-red-800">{error}</div>
        )}

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] lg:items-start">
          <div className="space-y-4">
            <SuperCard>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Eyebrow tone="muted">Équipe fondatrice</Eyebrow>
                  <h2 className="mt-2 font-display text-[1.6rem] font-normal">Les 5 responsabilités</h2>
                  <p className="mt-2 max-w-2xl text-body leading-6 text-slate-ink">
                    Les cinq fonctions sont occupées par cinq personnes distinctes. Les autres membres peuvent participer sans fonction fondatrice.
                  </p>
                </div>
                <UsersRound className="h-6 w-6 text-gold" />
              </div>

              <div className="mt-6 grid gap-3">
                {roles.map((assignment) => (
                  <RoleCard
                    key={assignment.role}
                    assignment={assignment}
                    members={members}
                    canManage={canManage}
                    working={working}
                    onAssign={assignRole}
                  />
                ))}
              </div>
            </SuperCard>

            <SuperCard>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Eyebrow tone="muted">Membres</Eyebrow>
                  <h2 className="mt-2 font-display text-[1.55rem] font-normal">{members.length} membre{members.length > 1 ? 's' : ''} actif{members.length > 1 ? 's' : ''}</h2>
                  <p className="mt-2 text-body text-slate-ink">Compétences, secteurs et localisation restent visibles ici seulement lorsqu’ils sont utiles au groupe.</p>
                </div>
                <Network className="h-6 w-6 text-slate-muted" />
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {members.map((member) => <MemberCard key={member.coreIdentityReference} member={member} />)}
              </div>
            </SuperCard>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <SuperCard>
              <span className="flex h-10 w-10 items-center justify-center rounded-tile bg-[#EAF6F0] text-[#2F7D5A]">
                <Link2 className="h-5 w-5" />
              </span>
              <Eyebrow className="mt-5" tone="muted">Inviter</Eyebrow>
              <h2 className="mt-2 font-display text-[1.45rem] font-normal">Faire grandir la Zumra</h2>

              {canManage ? (
                <>
                  <p className="mt-2 text-body leading-6 text-slate-ink">
                    Générez un lien valable 7 jours. Il est utilisable une seule fois par un membre ZUMRA actif.
                  </p>
                  <SuperButton type="button" onClick={createInvite} disabled={working === 'invite'} className="mt-5 w-full">
                    {working === 'invite' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    Créer une invitation
                  </SuperButton>

                  {inviteUrl && (
                    <div className="mt-4 rounded-tile border border-line bg-paper p-4">
                      <p className="text-meta leading-5 text-slate-muted">Le lien est prêt. Partagez-le uniquement avec la personne que vous souhaitez inviter.</p>
                      <button type="button" onClick={copyInvite} className="mt-3 inline-flex items-center gap-2 text-body font-medium text-gold">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Lien copié' : 'Copier le lien'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="mt-2 text-body leading-6 text-slate-ink">
                  Dans cette première version, les invitations sont générées par le responsable principal.
                </p>
              )}
            </SuperCard>

            {canManage && (
              <SuperCard>
                <Eyebrow tone="muted">Responsabilité principale</Eyebrow>
                <h2 className="mt-2 font-display text-[1.35rem] font-normal">Transmettre le rôle</h2>
                <p className="mt-2 text-body leading-6 text-slate-ink">
                  Le membre choisi devient responsable principal. Il doit être actif et ne pas déjà occuper une autre responsabilité fondatrice.
                </p>
                <select
                  value={principalTarget}
                  onChange={(event) => setPrincipalTarget(event.target.value)}
                  className="mt-5 w-full rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition focus:border-ink"
                >
                  <option value="">Choisir un membre</option>
                  {ordinaryMembers.map((member) => (
                    <option key={member.coreIdentityReference} value={member.coreIdentityReference}>{member.displayName}</option>
                  ))}
                </select>
                <SuperButton
                  type="button"
                  variant="secondary"
                  onClick={transferPrincipal}
                  disabled={!principalTarget || working === 'principal'}
                  className="mt-3 w-full"
                >
                  {working === 'principal' && <Loader2 className="h-4 w-4 animate-spin" />}
                  Transférer la responsabilité
                </SuperButton>
              </SuperCard>
            )}

            <SuperCard tone="dark">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                <div>
                  <Eyebrow>Principe ZUMRA</Eyebrow>
                  <p className="mt-3 text-body leading-6 text-ink-200">
                    Le but n’est pas de remplir des cases : les responsabilités servent à rendre l’action collective lisible et distribuée.
                  </p>
                </div>
              </div>
            </SuperCard>
          </aside>
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
  const assigned = Boolean(assignment.coreIdentityReference);

  return (
    <div className={`rounded-tile border p-4 sm:p-5 ${assigned ? 'border-[#C8DDD3] bg-[#F2F8F5]' : 'border-line bg-paper'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-body font-semibold text-ink">{assignment.label}</p>
          <p className="mt-1 text-meta text-slate-muted">{assignment.displayName || 'Responsabilité à attribuer'}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-medium ${assigned ? 'bg-[#DCEFE6] text-[#2F7D5A]' : 'bg-paper-card text-slate-muted'}`}>
          {assigned && <CheckCircle2 className="h-3 w-3" />}{assigned ? 'Attribuée' : 'Libre'}
        </span>
      </div>

      {canManage && assignment.role !== 'principal' && (
        <div className="mt-4 flex items-center gap-2">
          <select
            defaultValue={assignment.coreIdentityReference || ''}
            onChange={(event) => { if (event.target.value) void onAssign(assignment.role as Exclude<ZumraFoundingRole, 'principal'>, event.target.value); }}
            disabled={working === assignment.role}
            className="min-w-0 flex-1 rounded-tile border border-line-strong bg-paper px-3 py-2.5 text-meta font-medium outline-none transition focus:border-ink disabled:opacity-60"
          >
            <option value="">Choisir un membre</option>
            {eligible.map((member) => (
              <option key={member.coreIdentityReference} value={member.coreIdentityReference}>{member.displayName}</option>
            ))}
          </select>
          {working === assignment.role && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: ZumraGroupMember }) {
  return (
    <div className="rounded-tile border border-line bg-paper p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-body font-semibold text-ink">{member.displayName}</p>
          {(member.city || member.country) && (
            <p className="mt-1 inline-flex items-center gap-1 text-meta text-slate-muted">
              <MapPin className="h-3 w-3" /> {[member.city, member.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {member.role && (
          <span className="rounded-full bg-[#FBF1DC] px-2.5 py-1 text-[0.66rem] font-medium text-[#8B662B]">
            {ZUMRA_FOUNDING_ROLE_LABELS[member.role]}
          </span>
        )}
      </div>
      {member.sectors.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {member.sectors.slice(0, 3).map((sector) => (
            <span key={sector} className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] text-slate-muted">{sector}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function HeroProgress({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="rounded-tile border border-ink-500 bg-ink-700 p-5">
      <div className="flex items-center justify-between gap-4 text-body">
        <span className="text-ink-200">{label}</span>
        <span className="font-medium text-gold-400">{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-500">
        <div className="h-full rounded-full bg-gold-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function modeLabel(mode: string) {
  if (mode === 'digital') return '100 % numérique';
  if (mode === 'physical') return 'Présentiel';
  return 'Hybride';
}

function statusLabel(status: string) {
  if (status === 'active') return 'Zumra active';
  if (status === 'suspended') return 'Zumra suspendue';
  if (status === 'closed') return 'Zumra clôturée';
  return 'Zumra en formation';
}

function messageFor(code?: string) {
  const messages: Record<string, string> = {
    ACCES_ZUMRA_REFUSE: 'Vous n’êtes pas membre de cette Zumra.',
    RESPONSABLE_PRINCIPAL_REQUIS: 'Cette action est réservée au responsable principal.',
    MEMBRE_DEJA_ROLE_FONDATEUR: 'Ce membre occupe déjà une fonction fondatrice. Choisissez un membre sans fonction ou réattribuez d’abord son rôle actuel.',
    MEMBRE_INACTIF: 'Le membre choisi n’est pas actif dans cette Zumra.',
    ADHESION_NON_ACTIVE: 'Votre adhésion ZUMRA doit être active pour cette action.',
    ZUMRA_INTROUVABLE: 'Cette Zumra n’existe pas ou n’est plus disponible.',
  };
  return messages[code || ''] || 'L’action n’a pas pu être effectuée. Réessayez.';
}
