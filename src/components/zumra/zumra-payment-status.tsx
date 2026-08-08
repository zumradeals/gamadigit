'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react';

export function ZumraPaymentStatus() {
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const response = await fetch('/api/zumra/payments/membership/status', { cache: 'no-store' }).catch(() => null);
    if (response) {
      const body = await response.json().catch(() => ({})) as { membershipStatus?: string | null; paymentStatus?: string | null };
      setMembershipStatus(body.membershipStatus ?? null);
      setPaymentStatus(body.paymentStatus ?? null);
    }
    setLoading(false);
  }

  useEffect(() => { void refresh(); }, []);

  const active = membershipStatus === 'active';
  const failed = paymentStatus === 'failed' || paymentStatus === 'cancelled';

  return <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6"><div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-7 text-center sm:p-10">
    {loading ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-dgNavy" /> : active ? <CheckCircle2 className="mx-auto h-12 w-12 text-dgGreen" /> : failed ? <XCircle className="mx-auto h-12 w-12 text-red-500" /> : <RefreshCw className="mx-auto h-10 w-10 text-dgGold" />}
    <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Paiement ZUMRA · Sandbox</p>
    <h1 className="mt-3 text-3xl font-black text-dgNavy">{active ? 'Adhesion activee' : failed ? 'Paiement non finalise' : 'Confirmation en cours'}</h1>
    <p className="mt-4 leading-7 text-slate-600">{active ? 'Votre paiement sandbox a ete confirme par GeniusPay. Votre Carte ZUMRA et votre acces au reseau sont maintenant actifs.' : failed ? 'Le paiement n’a pas ete confirme. Vous pouvez revenir a votre dossier et lancer un nouveau test.' : 'Nous verifions directement le statut aupres de GeniusPay. Une redirection seule ne suffit jamais a activer votre adhesion.'}</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/espace" className="rounded-xl bg-dgNavy px-5 py-3 text-sm font-black text-white">Mon espace</Link>{!active && <button type="button" onClick={refresh} disabled={loading} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-dgNavy disabled:opacity-60">Verifier maintenant</button>}<Link href="/espace/zumra" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-dgNavy">Mon dossier ZUMRA</Link></div>
  </div></main>;
}
