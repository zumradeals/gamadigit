'use client';

import { useState } from 'react';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';

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
    const body = await response.json().catch(() => ({})) as { ok?: boolean; checkoutUrl?: string; alreadyActive?: boolean; error?: string };
    if (body.alreadyActive) {
      window.location.href = '/espace';
      return;
    }
    if (!response.ok || !body.ok || !body.checkoutUrl) {
      setError(body.error === 'GENIUSPAY_NON_CONFIGURE'
        ? 'Le sandbox GeniusPay n’est pas encore configure avec ses cles API.'
        : 'Le paiement GeniusPay est momentanement indisponible. Reessayez.');
      setLoading(false);
      return;
    }
    window.location.assign(body.checkoutUrl);
  }

  return <div className="rounded-[2rem] border border-dgGold/30 bg-dgIvory p-6 sm:p-8">
    <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-dgNavy"><CreditCard className="h-6 w-6" /></div><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Adhesion ZUMRA</p><h2 className="mt-2 text-xl font-black text-dgNavy">Finaliser mon adhesion</h2><p className="mt-2 text-sm leading-6 text-slate-600">Le test se fait exclusivement dans le sandbox GeniusPay. Vous serez redirige vers leur checkout pour choisir un moyen de paiement simule.</p></div></div>
    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-sm text-slate-600"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-dgGreen" /> La Carte ZUMRA et les fonctions du reseau ne sont activees qu’apres confirmation serveur d’un paiement marque completed.</div>
    {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
    <button type="button" onClick={pay} disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dgNavy px-5 py-4 text-sm font-black text-white disabled:opacity-60 sm:w-auto">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} Tester le paiement d’adhesion</button>
  </div>;
}
