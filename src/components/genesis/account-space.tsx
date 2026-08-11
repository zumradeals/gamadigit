'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, LogOut, RefreshCw } from 'lucide-react';
import { MemberHome } from '@/components/superapp/home/member-home';
import type { CapabilityProfile } from '@/lib/profile/capability-profile';
import type { ZumraGroupSummary, ZumraMePayload } from '@/lib/zumra/types';

type AccountPayload = {
  authenticated: boolean;
  error?: string;
  account?: {
    entity: string;
    assurance: string | null;
    expiresAt: string;
    identity: Record<string, unknown>;
  };
};

type ProfilePayload = {
  ok: boolean;
  profile?: CapabilityProfile;
  error?: string;
};

type GroupsPayload = {
  ok: boolean;
  groups?: ZumraGroupSummary[];
};

type LogoutPayload = {
  ok?: boolean;
  nextLogoutUrl?: string | null;
};

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

export function AccountSpace() {
  const [data, setData] = useState<AccountPayload | null>(null);
  const [profile, setProfile] = useState<CapabilityProfile | undefined>(undefined);
  const [zumra, setZumra] = useState<ZumraMePayload | null>(null);
  const [groups, setGroups] = useState<ZumraGroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadError('');
        const accountResponse = await fetch('/api/genesis/account/me', { cache: 'no-store' });
        const account = (await accountResponse.json()) as AccountPayload;

        if (accountResponse.status === 401 || !account.authenticated) {
          window.location.href = '/connexion';
          return;
        }

        if (!accountResponse.ok || !account.account) {
          throw new Error(account.error || 'ESPACE_TEMPORAIREMENT_INDISPONIBLE');
        }

        if (cancelled) return;
        setData(account);

        const [profileResponse, zumraResponse] = await Promise.all([
          fetch('/api/genesis/profile', { cache: 'no-store' }),
          fetch('/api/zumra/me', { cache: 'no-store' }),
        ]);

        if (profileResponse.ok) {
          const profileBody = (await profileResponse.json()) as ProfilePayload;
          if (!cancelled && profileBody.profile) setProfile(profileBody.profile);
        }

        if (zumraResponse.ok) {
          const zumraBody = (await zumraResponse.json()) as ZumraMePayload;
          if (!cancelled) setZumra(zumraBody);

          if (zumraBody.enrolled && zumraBody.membership?.status === 'active') {
            const groupsResponse = await fetch('/api/zumra/groups', { cache: 'no-store' });
            if (groupsResponse.ok) {
              const groupsBody = (await groupsResponse.json()) as GroupsPayload;
              if (!cancelled) setGroups(groupsBody.groups ?? []);
            }
          }
        }
      } catch {
        if (!cancelled) setLoadError('Votre espace est momentanément indisponible. Votre session reste ouverte ; réessayez dans un instant.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const identity = data?.account?.identity ?? {};
  const displayName = useMemo(
    () => text(identity.denomination) || text(identity.nom) || text(identity.libelle) || 'Utilisateur',
    [identity],
  );

  async function logout() {
    setLoggingOut(true);
    let nextUrl = '/';

    try {
      const response = await fetch('/api/genesis/account/logout', { method: 'POST' });
      const body = (await response.json().catch(() => ({}))) as LogoutPayload;
      if (response.ok && typeof body.nextLogoutUrl === 'string' && body.nextLogoutUrl) {
        nextUrl = body.nextLogoutUrl;
      }
    } catch {
      // Même si le canal satellite est indisponible, on quitte l'espace local.
    }

    window.location.href = nextUrl;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold"><Loader2 className="h-5 w-5 animate-spin text-gold" /> Chargement de votre espace…</div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="w-full max-w-lg rounded-card border border-line bg-paper-card p-7 text-center">
          <p className="font-display text-2xl">Votre espace reste connecté.</p>
          <p className="mt-3 text-body text-slate-ink">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-meta font-medium text-paper"
          >
            <RefreshCw className="h-4 w-4" /> Réessayer
          </button>
        </div>
      </main>
    );
  }

  if (!data?.authenticated || !data.account) {
    return (
      <main className="min-h-screen bg-paper px-4 py-16 text-center text-ink">
        <p className="font-semibold">Votre session n’est plus disponible.</p>
        <Link href="/connexion" className="mt-4 inline-block text-body font-semibold text-gold underline">Se reconnecter</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <MemberHome displayName={displayName} profile={profile} zumra={zumra} groups={groups} />
      <div className="mx-auto flex max-w-[73.75rem] justify-end px-4 pb-8 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper-card px-4 py-2.5 text-meta font-medium text-slate-ink transition-colors hover:border-ink disabled:opacity-50"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Se déconnecter
        </button>
      </div>
    </main>
  );
}
