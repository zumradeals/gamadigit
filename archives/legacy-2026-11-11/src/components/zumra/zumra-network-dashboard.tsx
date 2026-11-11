'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Link2,
  Loader2,
  MapPin,
  Network,
  Plus,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import type { ZumraGroupSummary, ZumraMePayload, ZumraParticipationMode } from '@/lib/zumra/types';
import { Eyebrow, SuperButton, SuperButtonLink, SuperCard } from '@/components/superapp/ui';

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
        if (meBody.profile) {
          setParticipationMode(meBody.profile.participationMode);
          setCountry(meBody.profile.country || '');
          setCity(meBody.profile.city || '');
          setSector(meBody.profile.sectors[0] || '');
        }

        if (!meResponse.ok || meBody.membership?.status !== 'active') return;

        const groupsResponse = await fetch('/api/zumra/groups', { cache: 'no-store' });
        const groupsBody = await groupsResponse.json() as { ok?: boolean; groups?: ZumraGroupSummary[]; error?: string };
        if (!groupsResponse.ok || !groupsBody.ok) throw new Error(groupsBody.error || 'ZUMRA_INDISPONIBLE');
        setGroups(groupsBody.groups ?? []);
      } catch {
        setError('Le réseau ZUMRA est momentanément indisponible.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const stats = useMemo(() => ({
    total: groups.length,
    active: groups.filter((group) => group.status === 'active').length,
    forming: groups.filter((group) => group.status === 'forming').length,
  }), [groups]);

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
      setError('Impossible de joindre le service. Réessayez.');
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-gold" /> Chargement du réseau ZUMRA…
        </div>
      </main>
    );
  }

  if (me?.membership?.status !== 'active') {
    return (
      <main className="min-h-screen bg-paper px-4 py-10 text-ink sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <SuperButtonLink as={Link} href="/espace" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
            <ArrowLeft className="h-4 w-4" /> Mon espace
          </SuperButtonLink>

          <SuperCard className="mt-7 overflow-hidden border-gold-line bg-[#FBF7EE] p-0 sm:p-0">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-start">
              <span className="flex h-12 w-12 items-center justify-center rounded-tile bg-paper text-gold">
                <Network className="h-6 w-6" />
              </span>
              <div>
                <Eyebrow>Étape 3 · Réseau</Eyebrow>
                <h1 className="mt-3 font-display text-[2rem] font-normal leading-tight">Activez d’abord votre adhésion ZUMRA.</h1>
                <p className="mt-3 max-w-2xl text-body leading-7 text-slate-ink">
                  La création et l’intégration d’une Zumra sont réservées aux membres dont l’adhésion est active. Votre profil, lui, peut déjà être préparé et modifié.
                </p>
                <SuperButtonLink as={Link} href="/espace/zumra" className="mt-6">
                  Voir mon parcours ZUMRA
                </SuperButtonLink>
              </div>
            </div>
          </SuperCard>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-4 pb-20 pt-6 text-ink sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-[73.75rem]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SuperButtonLink as={Link} href="/espace" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
            <ArrowLeft className="h-4 w-4" /> Mon espace
          </SuperButtonLink>
          <SuperButtonLink as={Link} href="/espace/zumra" variant="ghost" size="sm">
            Mon profil ZUMRA
          </SuperButtonLink>
        </div>

        <section className="overflow-hidden rounded-card border border-ink-500/40 bg-ink text-paper">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:p-10">
            <div>
              <Eyebrow>Réseau ZUMRA</Eyebrow>
              <h1 className="mt-4 max-w-3xl font-display text-[2.3rem] font-normal leading-[1.05] tracking-[-0.025em] sm:text-[3.1rem]">
                Passer du profil à l’action collective.
              </h1>
              <p className="mt-4 max-w-2xl text-body leading-7 text-ink-200">
                Une Zumra commence autour d’un objectif commun. Elle devient active lorsqu’au moins 5 membres sont réunis et que les 5 responsabilités fondatrices sont attribuées.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 self-end">
              <Stat value={stats.total} label="Mes Zumra" />
              <Stat value={stats.active} label="Actives" />
              <Stat value={stats.forming} label="En formation" />
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-tile border border-red-200 bg-red-50 p-4 text-body font-medium text-red-800">{error}</div>
        )}

        <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:items-start">
          <div className="space-y-4">
            <SuperCard>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Eyebrow tone="muted">Mes Zumra</Eyebrow>
                  <h2 className="mt-2 font-display text-[1.6rem] font-normal">Vos groupes et leur progression</h2>
                  <p className="mt-2 max-w-2xl text-body text-slate-ink">
                    Chaque carte montre ce qui manque encore pour l’activation. Aucune note ni classement : seulement l’état réel du groupe.
                  </p>
                </div>
                <UsersRound className="h-6 w-6 text-gold" />
              </div>

              {groups.length === 0 ? (
                <div className="mt-6 rounded-tile border border-dashed border-line-strong bg-paper p-6">
                  <p className="font-semibold text-ink">Vous n’appartenez encore à aucune Zumra.</p>
                  <p className="mt-2 max-w-xl text-body leading-6 text-slate-muted">
                    Vous pouvez créer votre premier groupe ici. Pour rejoindre une Zumra existante, utilisez le lien d’invitation transmis par son responsable principal.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 xl:grid-cols-2">
                  {groups.map((group) => <GroupCard key={group.id} group={group} />)}
                </div>
              )}
            </SuperCard>

            <SuperCard className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-tile bg-[#EAF6F0] text-[#2F7D5A]">
                <Link2 className="h-5 w-5" />
              </span>
              <div>
                <Eyebrow tone="muted">Rejoindre une Zumra</Eyebrow>
                <h2 className="mt-2 font-display text-[1.35rem] font-normal">L’entrée se fait aujourd’hui par invitation.</h2>
                <p className="mt-1 text-body text-slate-ink">
                  Ouvrez simplement le lien reçu : DG Afrique vérifie votre adhésion puis vous présente le groupe avant confirmation.
                </p>
              </div>
              <span className="text-meta text-slate-muted">Lien personnel</span>
            </SuperCard>
          </div>

          <form onSubmit={createGroup} className="lg:sticky lg:top-28">
            <SuperCard className="p-0 sm:p-0">
              <div className="border-b border-line p-5 sm:p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-tile bg-paper text-gold">
                  <Plus className="h-5 w-5" />
                </span>
                <Eyebrow className="mt-5" tone="muted">Créer une Zumra</Eyebrow>
                <h2 className="mt-2 font-display text-[1.55rem] font-normal">Démarrer autour d’un objectif concret</h2>
                <p className="mt-2 text-body leading-6 text-slate-ink">
                  En créant le groupe, vous devenez responsable principal. Cette responsabilité pourra ensuite être transférée à un autre membre actif.
                </p>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <Field label="Nom de la Zumra" value={name} onChange={setName} placeholder="Ex. Bâtiment Abidjan Nord" required />
                <Field label="Secteur d’activité" value={sector} onChange={setSector} placeholder="Bâtiment, agriculture, numérique…" required />

                <label className="block text-body font-semibold text-ink">
                  Objectif commun
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={objective}
                    onChange={(event) => setObjective(event.target.value)}
                    placeholder="Que voulez-vous apprendre, réaliser ou développer ensemble ?"
                    className="mt-2 w-full resize-y rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition placeholder:text-slate-muted focus:border-ink"
                  />
                </label>

                <label className="block text-body font-semibold text-ink">
                  Mode de participation
                  <select
                    value={participationMode}
                    onChange={(event) => setParticipationMode(event.target.value as ZumraParticipationMode)}
                    className="mt-2 w-full rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition focus:border-ink"
                  >
                    <option value="physical">En présentiel</option>
                    <option value="digital">100 % numérique</option>
                    <option value="both">Hybride</option>
                  </select>
                </label>

                {participationMode !== 'digital' && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <Field label="Pays" value={country} onChange={setCountry} required icon={<MapPin className="h-4 w-4" />} />
                    <Field label="Ville / Localité" value={city} onChange={setCity} required />
                  </div>
                )}

                <div className="rounded-tile border border-gold-line bg-[#FBF7EE] p-4 text-meta leading-5 text-slate-ink">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>La création ouvre un groupe « en formation ». L’activation dépend ensuite des membres et des responsabilités réellement attribuées.</span>
                  </div>
                </div>

                <SuperButton disabled={saving} size="lg" className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Créer ma Zumra
                </SuperButton>
              </div>
            </SuperCard>
          </form>
        </section>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-tile border border-ink-500 bg-ink-700 px-3 py-4 text-center">
      <p className="font-display text-[1.6rem] leading-none text-paper">{value}</p>
      <p className="mt-2 text-[0.68rem] leading-4 text-ink-200">{label}</p>
    </div>
  );
}

function GroupCard({ group }: { group: ZumraGroupSummary }) {
  const memberPercent = Math.min(100, (group.activeMembers / group.requiredMembers) * 100);
  const rolePercent = Math.min(100, (group.rolesFilled / group.requiredRoles) * 100);
  const active = group.status === 'active';

  return (
    <Link
      href={`/espace/zumra/reseau/${group.id}`}
      className="group rounded-tile border border-line bg-paper p-5 transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-body font-semibold text-ink">{group.name}</h3>
            <span className={`rounded-full px-2.5 py-1 text-[0.66rem] font-medium ${active ? 'bg-[#EAF6F0] text-[#2F7D5A]' : 'bg-[#FBF1DC] text-[#8B662B]'}`}>
              {active ? 'Active' : 'En formation'}
            </span>
          </div>
          <p className="mt-1 text-meta text-slate-muted">{group.sector} · {modeLabel(group.participationMode)}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>

      <p className="mt-4 line-clamp-2 text-body leading-6 text-slate-ink">{group.objective}</p>

      <div className="mt-5 space-y-3">
        <Progress label="Membres actifs" value={`${group.activeMembers}/${group.requiredMembers}`} percent={memberPercent} />
        <Progress label="Responsabilités" value={`${group.rolesFilled}/${group.requiredRoles}`} percent={rolePercent} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-meta">
        <span className="text-slate-muted">{group.city || group.country ? [group.city, group.country].filter(Boolean).join(', ') : 'Groupe numérique'}</span>
        {group.currentRole ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-[#2F7D5A]">
            <CheckCircle2 className="h-3.5 w-3.5" /> {roleLabel(group.currentRole)}
          </span>
        ) : (
          <span className="text-slate-muted">Membre</span>
        )}
      </div>
    </Link>
  );
}

function Progress({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-meta">
        <span className="text-slate-muted">{label}</span>
        <span className="font-medium text-ink">{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-soft">
        <div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required = false, icon }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block text-body font-semibold text-ink">
      <span className="flex items-center gap-2">{icon}{label}</span>
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition placeholder:text-slate-muted focus:border-ink"
      />
    </label>
  );
}

function modeLabel(mode: ZumraParticipationMode) {
  if (mode === 'digital') return 'Numérique';
  if (mode === 'physical') return 'Présentiel';
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
  return labels[role] || 'Membre';
}

function messageFor(code?: string) {
  const messages: Record<string, string> = {
    ADHESION_NON_ACTIVE: 'Votre adhésion ZUMRA doit être active avant de créer une Zumra.',
    LOCALISATION_REQUISE: 'Indiquez le pays et la ville pour une Zumra en présentiel ou hybride.',
    FORMULAIRE_INVALIDE: 'Vérifiez le nom, le secteur, l’objectif et le mode de participation.',
  };
  return messages[code || ''] || 'La Zumra n’a pas pu être créée. Réessayez.';
}
