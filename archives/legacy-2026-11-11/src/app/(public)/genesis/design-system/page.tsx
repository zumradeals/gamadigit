import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Avatar,
  CapabilityChip,
  EmptyState,
  KindBadge,
  ProgressBar,
  SearchField,
  SectionHeading,
  SuperButtonLink,
  SuperCard,
} from '@/components/superapp/ui';

export const metadata: Metadata = {
  title: 'Laboratoire design Super App — DG AFRIQUE',
  robots: { index: false, follow: false },
};

export default function SuperAppDesignSystemLab() {
  return (
    <main className="min-h-screen bg-paper px-4 py-10 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-label uppercase tracking-[0.1em] text-gold">Migration Claude → V1</p>
            <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.03em] sm:text-5xl">Design system DG Afrique</h1>
            <p className="mt-3 max-w-2xl text-lead text-slate-ink">Laboratoire visuel isolé. Aucun mock métier n’est branché à la production.</p>
          </div>
          <SuperButtonLink as={Link} href="/genesis" variant="secondary">Retour au portail</SuperButtonLink>
        </div>

        <section className="mt-12">
          <SectionHeading title="Surfaces & actions" description="Primitives portées du handoff Claude vers Next.js/TypeScript." />
          <div className="grid gap-5 md:grid-cols-2">
            <SuperCard>
              <p className="font-display text-2xl">Une surface éditoriale claire</p>
              <p className="mt-3 text-body text-slate-ink">Les cartes restent calmes. L’information métier garde la priorité sur la décoration.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <SuperButtonLink as={Link} href="/genesis/espace">Action principale</SuperButtonLink>
                <SuperButtonLink as={Link} href="/genesis" variant="secondary">Secondaire</SuperButtonLink>
                <SuperButtonLink as={Link} href="/genesis" variant="gold">Accent</SuperButtonLink>
              </div>
            </SuperCard>
            <SuperCard tone="dark">
              <p className="font-display text-2xl">ZUMRA / collectif</p>
              <p className="mt-3 text-body text-ink-200">Le ton sombre est réservé aux espaces à forte identité collective ou graphe.</p>
              <div className="mt-6"><SuperButtonLink as={Link} href="/espace/zumra" variant="onDark">Découvrir ZUMRA</SuperButtonLink></div>
            </SuperCard>
          </div>
        </section>

        <section className="mt-12">
          <SectionHeading title="Capacités" aside="Pas de score humain" description="La couleur décrit l’état d’une capacité et non la valeur d’une personne." />
          <SuperCard>
            <div className="flex flex-wrap gap-2">
              <CapabilityChip label="Développement web" state="ok" />
              <CapabilityChip label="Comptabilité" state="learning" />
              <CapabilityChip label="Logistique" state="missing" />
              <CapabilityChip label="Créer un projet" state="intent" />
              <CapabilityChip label="Non renseigné" state="empty" />
              <CapabilityChip label="Agriculture" />
            </div>
            <div className="mt-7">
              <ProgressBar segments={[
                { pct: 44, className: 'bg-jade' },
                { pct: 18, className: 'bg-gold-400' },
                { pct: 38, className: 'bg-clay' },
              ]} />
            </div>
          </SuperCard>
        </section>

        <section className="mt-12">
          <SectionHeading title="Objets du graphe" description="Même vocabulaire visuel dans Explorer, ZUMRA, projets et recommandations." />
          <SuperCard>
            <div className="flex flex-wrap items-center gap-3">
              <KindBadge kind="FORMATION" />
              <KindBadge kind="OPPORTUNITÉ" />
              <KindBadge kind="PROJET" />
              <KindBadge kind="ZUMRA" />
              <KindBadge kind="CAPACITÉ" />
              <KindBadge kind="SERVICE" />
              <KindBadge kind="PERSONNE" />
            </div>
            <div className="mt-7 flex items-center gap-3">
              <Avatar initials="ZK" size="lg" />
              <div><p className="font-medium">Une seule identité publique</p><p className="text-meta text-slate-muted">Le Core reste invisible dans l’interface.</p></div>
            </div>
          </SuperCard>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading title="Recherche" />
            <SearchField placeholder="Compétence, projet, formation, Zumra…" />
          </div>
          <SuperCard>
            <EmptyState eyebrow="Prochaine action" title="Votre parcours se construit progressivement" description="Les états vides doivent toujours expliquer ce que la personne peut faire maintenant." />
          </SuperCard>
        </section>
      </div>
    </main>
  );
}
