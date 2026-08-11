'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Cloud,
  Compass,
  Hammer,
  Network,
  WalletCards,
} from 'lucide-react';
import type { ZumraGroupSummary, ZumraMePayload, ZumraProfile } from '@/lib/zumra/types';
import { CapabilityChip, EmptyState, Eyebrow, SuperButtonLink, SuperCard } from '@/components/superapp/ui';
import { IntentCard, type HomeIntent } from './intent-card';
import { NextActionCard, type NextAction } from './next-action';

const intents: HomeIntent[] = [
  { id: 'learn', label: 'Apprendre', description: 'Développer une compétence ou trouver une formation.', href: '/formations', icon: BookOpen },
  { id: 'explore', label: 'Explorer', description: 'Découvrir des opportunités et des possibilités utiles.', href: '/opportunites', icon: Compass },
  { id: 'build', label: 'Construire', description: 'Faire avancer une idée, un besoin ou un projet.', href: '/contact', icon: Hammer },
  { id: 'produce', label: 'Produire', description: 'Accéder aux outils et services numériques disponibles.', href: '/pole-numerique', icon: BriefcaseBusiness },
];

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function profileCompletion(profile?: ZumraProfile) {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.displayName),
    Boolean(profile.country),
    Boolean(profile.city),
    Boolean(profile.phone),
    profile.skills.length > 0 || profile.noSkillsYet,
    profile.learningGoals.length > 0,
    profile.sectors.length > 0,
    profile.intentions.length > 0,
    Boolean(profile.participationMode),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function contributionLabel(status?: string) {
  if (status === 'up_to_date') return 'À jour';
  if (status === 'grace') return 'Période de grâce';
  if (status === 'late') return 'En retard';
  return 'Non démarrée';
}

function nextActionFor(zumra: ZumraMePayload | null, groups: ZumraGroupSummary[]): NextAction {
  if (!zumra?.enrolled) {
    return {
      eyebrow: 'Prochaine action utile',
      title: 'Choisissez votre première direction',
      description: 'Votre compte DG Afrique est prêt. Explorez les opportunités maintenant ; ZUMRA reste un parcours distinct que vous pouvez rejoindre lorsque vous le souhaitez.',
      href: '/opportunites',
      cta: 'Explorer',
    };
  }

  if (zumra.membership?.status === 'pending_payment') {
    return {
      eyebrow: 'Adhésion ZUMRA',
      title: 'Finalisez votre adhésion',
      description: 'Votre dossier est enregistré. L’adhésion devient active seulement après confirmation serveur du paiement initial.',
      href: '/espace/zumra',
      cta: 'Finaliser mon adhésion',
    };
  }

  const completion = profileCompletion(zumra.profile);
  if (zumra.membership?.status === 'active' && completion < 100) {
    return {
      eyebrow: 'Profil de capacités',
      title: 'Rendez votre profil plus utile',
      description: 'Compétences, apprentissages, secteurs et intentions permettront progressivement à DG Afrique de mieux orienter votre parcours.',
      href: '/espace/zumra',
      cta: 'Enrichir mon profil',
      progress: completion,
      progressLabel: `Profil ${completion} %`,
    };
  }

  if (zumra.membership?.status === 'active' && groups.length === 0) {
    return {
      eyebrow: 'Réseau ZUMRA',
      title: 'Passez du profil à l’action collective',
      description: 'Découvrez le réseau, rejoignez une Zumra pertinente ou créez-en une autour d’un objectif concret.',
      href: '/espace/zumra/reseau',
      cta: 'Ouvrir le réseau',
    };
  }

  const group = groups[0];
  if (zumra.membership?.status === 'active' && group) {
    return {
      eyebrow: group.status === 'forming' ? 'Zumra en formation' : 'Action collective',
      title: group.status === 'forming' ? `Faire grandir ${group.name}` : `Reprendre ${group.name}`,
      description: group.status === 'forming'
        ? `${group.activeMembers} membre${group.activeMembers > 1 ? 's' : ''} actif${group.activeMembers > 1 ? 's' : ''} sur 5 requis pour l’activation. Les responsabilités fondatrices doivent aussi être attribuées.`
        : 'Votre espace collectif est actif. Retrouvez les membres, responsabilités et prochaines actions.',
      href: `/espace/zumra/reseau/${group.id}`,
      cta: 'Ouvrir ma Zumra',
    };
  }

  return {
    eyebrow: 'Aujourd’hui',
    title: 'Explorez ce qui peut vous faire avancer',
    description: 'DG Afrique rassemble progressivement formations, opportunités, réseau, projets et outils autour de votre parcours.',
    href: '/opportunites',
    cta: 'Découvrir',
  };
}

type Props = {
  displayName: string;
  zumra: ZumraMePayload | null;
  groups: ZumraGroupSummary[];
};

export function MemberHome({ displayName, zumra, groups }: Props) {
  const firstName = displayName.trim().split(/\s+/)[0] || displayName;
  const nextAction = nextActionFor(zumra, groups);
  const profile = zumra?.profile;
  const active = zumra?.enrolled && zumra.membership?.status === 'active';
  const primaryGroup = groups[0];
  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <div className="mx-auto max-w-[73.75rem] px-4 pb-16 pt-7 sm:px-8 lg:px-12 lg:pt-11">
      <header className="mb-7">
        <div className="mb-3 font-mono text-[0.69rem] uppercase tracking-[0.1em] text-slate-muted">{today}</div>
        <h1 className="mb-2 font-display text-[2rem] font-normal leading-[1.1] tracking-[-0.02em] lg:text-[2.85rem]">Bonjour {firstName}.</h1>
        <p className="text-[1.1rem] text-slate-ink lg:text-[1.25rem]">Que souhaitez-vous faire aujourd’hui ?</p>
      </header>

      <div className="mb-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {intents.map((intent) => <IntentCard key={intent.id} intent={intent} />)}
      </div>

      <NextActionCard action={nextAction} />

      <ServicesPanel />

      <div className="my-3.5 grid gap-3.5 lg:grid-cols-2">
        <ZumraSituation zumra={zumra} group={primaryGroup} />
        <CapabilitiesPanel profile={profile} />
      </div>

      {active && (
        <section className="mt-3.5 overflow-hidden rounded-card border border-gold-line bg-ink p-[1.375rem] text-paper">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <WalletCards aria-hidden="true" className="h-4 w-4 text-gold-400" />
                <Eyebrow>Contribution mensuelle & projets</Eyebrow>
              </div>
              <h2 className="mt-3 font-display text-[1.55rem] font-normal">Construire une capacité financière communautaire</h2>
              <p className="mt-2 max-w-3xl text-body text-ink-200">Les contributions mensuelles ont vocation à permettre à la communauté d’amorcer ses propres projets avant l’arrivée éventuelle de partenaires. Les montants collectés, affectations, décaissements et preuves seront rendus lisibles à mesure que le module financier est activé.</p>
            </div>
            <div className="rounded-tile border border-ink-500 bg-ink-700 px-5 py-4 lg:min-w-52">
              <p className="font-mono text-label uppercase tracking-[0.1em] text-gold-400">Ma contribution</p>
              <p className="mt-2 font-semibold">{contributionLabel(zumra.membership?.contributionStatus)}</p>
              <p className="mt-1 text-meta text-ink-200">Flux distinct de l’adhésion initiale.</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-3.5 rounded-card border border-line bg-paper-card p-[1.375rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow tone="muted">DG Afrique devient progressivement votre portail d’action</Eyebrow>
            <h2 className="mt-2 text-[1.08rem] font-semibold">Les recommandations apparaîtront lorsqu’elles pourront être expliquées par des données réelles.</h2>
          </div>
          <span className="text-meta text-slate-muted">Correspondance, pas notation</span>
        </div>
      </section>
    </div>
  );
}

function ServicesPanel() {
  return (
    <section className="mt-3.5 rounded-card border border-line bg-paper-card p-[1.375rem]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow tone="muted">Mes services</Eyebrow>
          <h2 className="mt-2 font-display text-[1.45rem]">Vos outils, accessibles avec la même identité</h2>
          <p className="mt-1 max-w-2xl text-body text-slate-ink">DG Afrique vous conduit vers les produits disponibles sans vous demander de créer un nouveau mot de passe.</p>
        </div>
        <span className="rounded-full border border-line px-3 py-1.5 text-label font-medium text-slate-muted">1 service disponible</span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <Link
          href="/federation/continue/gamadrive"
          prefetch={false}
          className="group rounded-tile border border-line-strong bg-paper p-5 transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-ink text-gold-400">
                <Cloud aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">GamaDrive</h3>
                  <span className="rounded-full bg-[#EAF6F0] px-2 py-0.5 text-[0.68rem] font-medium text-[#2F7D5A]">Disponible</span>
                </div>
                <p className="mt-1 text-body text-slate-ink">Accédez à votre espace de données GamaDrive avec votre identité DG Afrique.</p>
                <p className="mt-3 text-meta text-slate-muted">Connexion fédérée · Service rattaché au portail</p>
              </div>
            </div>
            <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-slate-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
          </div>
        </Link>
      </div>
    </section>
  );
}

function ZumraSituation({ zumra, group }: { zumra: ZumraMePayload | null; group?: ZumraGroupSummary }) {
  if (!zumra?.enrolled) {
    return (
      <SuperCard>
        <Network aria-hidden="true" className="h-6 w-6 text-gold" />
        <Eyebrow className="mt-5">Programme ZUMRA</Eyebrow>
        <h2 className="mt-3 font-display text-[1.45rem]">Apprendre · Transmettre · Agir</h2>
        <p className="mt-2 text-body text-slate-ink">ZUMRA est un programme distinct de votre compte DG Afrique. Découvrez-le ou rejoignez-le lorsque ce parcours correspond à votre intention.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <SuperButtonLink as={Link} href="/espace/zumra">Rejoindre ZUMRA</SuperButtonLink>
          <SuperButtonLink as={Link} href="/programme-zumra" variant="secondary">Découvrir</SuperButtonLink>
        </div>
      </SuperCard>
    );
  }

  if (zumra.membership?.status === 'pending_payment') {
    return (
      <SuperCard>
        <Eyebrow>Adhésion ZUMRA</Eyebrow>
        <h2 className="mt-3 font-display text-[1.45rem]">Paiement initial à finaliser</h2>
        <p className="mt-2 text-body text-slate-ink">Votre dossier existe déjà. L’accès membre et la Carte ZUMRA sont activés après confirmation serveur du paiement d’adhésion.</p>
        <div className="mt-5"><SuperButtonLink as={Link} href="/espace/zumra">Finaliser</SuperButtonLink></div>
      </SuperCard>
    );
  }

  if (zumra.membership?.status === 'active') {
    return (
      <SuperCard tone="dark">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Eyebrow>Ma situation ZUMRA</Eyebrow>
            <h2 className="mt-3 font-display text-[1.45rem]">Adhésion active</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-meta text-[#8FD3B8]"><span className="h-1.5 w-1.5 rounded-full bg-[#4FBF93]" />Active</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Fact label="Membre depuis" value={formatDate(zumra.membership.memberSince) ?? 'Date non disponible'} />
          <Fact label="Contribution" value={contributionLabel(zumra.membership.contributionStatus)} />
          {group && <Fact label="Ma Zumra" value={group.name} />}
          {group && <Fact label="Rôle" value={group.currentRole ? roleLabel(group.currentRole) : 'Membre'} />}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <SuperButtonLink as={Link} href={group ? `/espace/zumra/reseau/${group.id}` : '/espace/zumra/reseau'} variant="onDark">{group ? 'Ouvrir ma Zumra' : 'Ouvrir le réseau'}</SuperButtonLink>
          <SuperButtonLink as={Link} href="/espace/zumra" variant="onDark">Mon profil ZUMRA</SuperButtonLink>
        </div>
      </SuperCard>
    );
  }

  return <SuperCard><EmptyState eyebrow="ZUMRA" title="Votre parcours demande une vérification" description="Votre compte DG Afrique reste disponible. Ouvrez ZUMRA pour consulter l’état actuel de votre adhésion." cta={undefined} /></SuperCard>;
}

function CapabilitiesPanel({ profile }: { profile?: ZumraProfile }) {
  const hasData = Boolean(profile && (profile.skills.length || profile.learningGoals.length || profile.intentions.length));
  return (
    <SuperCard>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Eyebrow tone="muted">Mon profil de capacités</Eyebrow>
          <h2 className="mt-2 font-display text-[1.4rem]">Ce que je sais, apprends et veux faire</h2>
        </div>
        {profile && <SuperButtonLink as={Link} href="/espace/zumra" variant="ghost" size="sm">Gérer</SuperButtonLink>}
      </div>
      {!hasData ? (
        <EmptyState title="Votre graphe personnel commence ici" description="Déclarez ce que vous savez faire, ce que vous souhaitez apprendre et vos intentions. Aucun diplôme n’est nécessaire pour commencer." />
      ) : (
        <div className="space-y-5">
          {profile!.skills.length > 0 && <CapabilityRow title="Je sais faire" items={profile!.skills} state="ok" />}
          {profile!.learningGoals.length > 0 && <CapabilityRow title="Je veux apprendre" items={profile!.learningGoals} state="learning" />}
          {profile!.intentions.length > 0 && <CapabilityRow title="Mes intentions" items={profile!.intentions} state="intent" />}
          {profile!.noSkillsYet && profile!.skills.length === 0 && <p className="text-body text-slate-ink">Vous avez indiqué commencer sans compétence particulière. Ce n’est pas un profil vide : vos objectifs d’apprentissage peuvent guider la suite.</p>}
        </div>
      )}
    </SuperCard>
  );
}

function CapabilityRow({ title, items, state }: { title: string; items: string[]; state: 'ok' | 'learning' | 'intent' }) {
  return <div><p className="mb-2 text-meta font-semibold text-slate-muted">{title}</p><div className="flex flex-wrap gap-1.5">{items.map((item) => <CapabilityChip key={`${title}-${item}`} label={item} state={state} />)}</div></div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-tile border border-ink-500/50 bg-ink-700 px-4 py-3"><p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-200">{label}</p><p className="mt-1 text-body text-paper">{value}</p></div>;
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    principal: 'Responsable principal',
    deputy_1: 'Responsable adjoint 1',
    deputy_2: 'Responsable adjoint 2',
    finance: 'Responsable financier',
    social: 'Responsable des affaires sociales',
  };
  return labels[role] ?? 'Membre';
}
