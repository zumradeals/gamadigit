'use client';

import { useState } from 'react';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { Eyebrow, SuperButton, SuperCard } from '@/components/superapp/ui';

export function ZumraMembershipPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    setLoading(true);
    setError('');
    const response = await fetch('/api/zumra/payments/membership', { method: 'POST' }).catch(() => null);
    if (!response) {
      setError('Impossible de joindre le service de paiement.');
      setLoading(false);
      return;
    }

    const body = await response.json().catch(() => ({})) as {
      ok?: boolean;
      checkoutUrl?: string;
      alreadyActive?: boolean;
      error?: string;
    };

    if (body.alreadyActive) {
      window.location.href = '/espace';
      return;
    }

    if (!response.ok || !body.ok || !body.checkoutUrl) {
      setError(body.error === 'GENIUSPAY_NON_CONFIGURE'
        ? 'Le sandbox GeniusPay n’est pas encore configuré avec ses clés API.'
        : 'Le paiement GeniusPay est momentanément indisponible. Réessayez.');
      setLoading(false);
      return;
    }

    window.location.assign(body.checkoutUrl);
  }

  return (
    <SuperCard className="overflow-hidden border-gold-line bg-[#FBF7EE] p-0 sm:p-0">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-paper text-gold">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <Eyebrow>Étape 2 · Adhésion</Eyebrow>
            <h2 className="mt-2 font-display text-[1.5rem] font-normal">Finaliser votre adhésion ZUMRA</h2>
            <p className="mt-2 max-w-2xl text-body leading-6 text-slate-ink">
              Votre dossier est enregistré. L’adhésion devient active seulement après confirmation serveur du paiement initial.
            </p>
          </div>
        </div>

        <SuperButton type="button" onClick={pay} disabled={loading} size="lg" className="w-full lg:w-auto">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Finaliser l’adhésion
        </SuperButton>
      </div>

      <div className="border-t border-gold-line bg-paper/60 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3 text-meta leading-5 text-slate-ink">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2F7D5A]" />
          <span>La Carte ZUMRA et l’accès au réseau ne sont activés qu’après confirmation serveur d’un paiement marqué completed. Le paiement d’adhésion reste distinct de la contribution mensuelle.</span>
        </div>
        {error && <p className="mt-3 rounded-tile border border-red-200 bg-red-50 px-4 py-3 text-body font-medium text-red-800">{error}</p>}
      </div>
    </SuperCard>
  );
}
