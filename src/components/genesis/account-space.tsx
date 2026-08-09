'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { MemberHome } from '@/components/superapp/home/member-home';
import type { ZumraGroupSummary, ZumraMePayload } from '@/lib/zumra/types';

type AccountPayload = {
  authenticated: boolean;
  account?: {
    entity: string;
    assurance: string | null;
    expiresAt: string;
    identity: Record<string, unknown>;
  };
};

type GroupsPayload = {
  ok: boolean;
  groups?: ZumraGroupSummary[];
};

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null;
}

export function AccountSpace() {
  const [data, setData] = useState<AccountPayload | null>(null);
  const [zumra, setZumra] = useState<ZumraMePayload | null>(null);
  const [groups, setGroups] = useState<ZumraGroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const accountResponse = await fetch('/api/genesis/account/me', { cache: 'no-store' });
        const account = (await accountResponse.json()) as AccountPayload;
        if (!accountResponse.ok || !account.authenticated) {
          window.location.href = '/connexion';
          return;
        }
        if (cancelled) return;
        setData(account);

        const zumraResponse = await fetch('/api/zumra/me', { cache: 'no-store' });
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
        if (!cancelled) setData({ authenticated: false });
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
    await fetch('/api/genesis/account/logout', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/';
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold"><Loader2 className="h-5 w-5 animate-spin text-gold" /> Chargement de votre espace…</div>
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
      <div className="border-b border-line bg-paper/95">
        <div className="mx-auto flex max-w-[73.75rem] items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400">
            <span className="font-display text-[1.3rem] tracking-[-0.02em]">DG Afrique</span>
            <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.12em] text-slate-muted sm:inline">Mon espace</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/opportunites" className="hidden rounded-full px-3 py-2 text-meta font-medium text-slate-ink hover:bg-paper-warm sm:inline-flex">Opportunités</Link>
            <Link href="/espace/zumra" className="hidden rounded-full px-3 py-2 text-meta font-medium text-slate-ink hover:bg-paper-warm sm:inline-flex">ZUMRA</Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper-card px-3.5 py-2 text-meta font-medium transition-colors hover:border-ink disabled:opacity-50"
            >
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <MemberHome displayName={displayName} zumra={zumra} groups={groups} />
    </main>
  );
}
