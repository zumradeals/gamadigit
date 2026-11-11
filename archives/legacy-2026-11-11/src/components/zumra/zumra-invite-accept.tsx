'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Network, ShieldCheck, UsersRound } from 'lucide-react';
import { Eyebrow, SuperButton, SuperButtonLink, SuperCard } from '@/components/superapp/ui';

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
      setError('Impossible de vérifier cette invitation.');
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-gold" /> Vérification de l’invitation…
        </div>
      </main>
    );
  }

  if (!data?.group) {
    return (
      <main className="min-h-screen bg-paper px-4 py-12 text-ink sm:px-8">
        <div className="mx-auto max-w-3xl">
          <SuperButtonLink as={Link} href="/espace" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
            <ArrowLeft className="h-4 w-4" /> Mon espace
          </SuperButtonLink>
          <SuperCard className="mt-7 border-red-200 bg-red-50">
            <Eyebrow tone="muted">Invitation ZUMRA</Eyebrow>
            <h1 className="mt-3 font-display text-[2rem] font-normal">Invitation indisponible</h1>
            <p className="mt-3 text-body leading-7 text-red-800">{error || 'Ce lien n’est plus utilisable.'}</p>
          </SuperCard>
        </div>
      </main>
    );
  }

  const group = data.group;
  const location = [group.city, group.country].filter(Boolean).join(', ');

  return (
    <main className="min-h-screen bg-paper px-4 pb-20 pt-6 text-ink sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-4xl">
        <SuperButtonLink as={Link} href="/espace" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
          <ArrowLeft className="h-4 w-4" /> Mon espace
        </SuperButtonLink>

        <section className="mt-6 overflow-hidden rounded-card border border-ink-500/40 bg-ink text-paper">
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-tile border border-ink-500 bg-ink-700 text-gold-400">
              <Network className="h-5 w-5" />
            </span>
            <Eyebrow className="mt-6">Invitation ZUMRA</Eyebrow>
            <h1 className="mt-3 font-display text-[2.35rem] font-normal leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">{group.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-body text-ink-200">
              <span>{group.sector}</span>
              <span aria-hidden="true">·</span>
              <span>{modeLabel(group.participationMode)}</span>
              {location && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {location}</span>
                </>
              )}
            </div>
            <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-ink-200">{group.objective}</p>
          </div>
        </section>

        {error && <div className="mt-5 rounded-tile border border-red-200 bg-red-50 p-4 text-body font-medium text-red-800">{error}</div>}

        <SuperCard className="mt-5 p-0 sm:p-0">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[auto_1fr]">
            <span className="flex h-11 w-11 items-center justify-center rounded-tile bg-[#EAF6F0] text-[#2F7D5A]">
              <UsersRound className="h-5 w-5" />
            </span>
            <div>
              <Eyebrow tone="muted">Rejoindre ce groupe</Eyebrow>
              <h2 className="mt-2 font-display text-[1.55rem] font-normal">Vous voyez le groupe avant de confirmer.</h2>
              <p className="mt-2 text-body leading-7 text-slate-ink">
                En acceptant, vous devenez membre actif de cette Zumra. Une responsabilité fondatrice pourra ensuite vous être attribuée par le responsable principal.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MiniFact icon={<CheckCircle2 className="h-4 w-4" />} text="Votre identité DG Afrique reste la même" />
                <MiniFact icon={<ShieldCheck className="h-4 w-4" />} text="Aucun mot de passe supplémentaire n’est créé" />
              </div>

              {data.canAccept ? (
                <SuperButton type="button" onClick={accept} disabled={joining} size="lg" className="mt-6 w-full sm:w-auto">
                  {joining && <Loader2 className="h-4 w-4 animate-spin" />}
                  Accepter et rejoindre la Zumra
                </SuperButton>
              ) : (
                <div className="mt-6 rounded-tile border border-gold-line bg-[#FBF7EE] p-4 text-body leading-6 text-[#6E5224]">
                  Votre adhésion ZUMRA doit être active avant de rejoindre ce groupe.{' '}
                  <Link href="/espace/zumra" className="font-semibold underline underline-offset-2">Voir mon parcours d’adhésion</Link>.
                </div>
              )}
            </div>
          </div>
        </SuperCard>
      </div>
    </main>
  );
}

function MiniFact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-start gap-2.5 rounded-tile border border-line bg-paper p-3 text-meta leading-5 text-slate-ink"><span className="mt-0.5 text-[#2F7D5A]">{icon}</span><span>{text}</span></div>;
}

function modeLabel(mode: string) {
  if (mode === 'digital') return '100 % numérique';
  if (mode === 'physical') return 'Présentiel';
  return 'Hybride';
}

function messageFor(code?: string) {
  const messages: Record<string, string> = {
    INVITATION_INVALIDE: 'Cette invitation a déjà été utilisée, révoquée ou n’existe pas.',
    INVITATION_EXPIREE: 'Cette invitation a expiré. Demandez un nouveau lien au responsable principal.',
    ADHESION_NON_ACTIVE: 'Votre adhésion ZUMRA doit être active avant de rejoindre une Zumra.',
  };
  return messages[code || ''] || 'Cette invitation ne peut pas être utilisée pour le moment.';
}
