'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, ShieldCheck, UserRound } from 'lucide-react';

type Mode = 'login' | 'register';
type Pending = {
  identity: string;
  identifierReference: string;
  verificationReference: string;
  expiresAt: string;
  channel: 'EMAIL';
};

export function AccountLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  function messageFor(code: string) {
    const messages: Record<string, string> = {
      IDENTIFIANT_OU_SECRET_REFUSE: 'Adresse email ou mot de passe incorrect.',
      MOT_DE_PASSE_TROP_COURT: 'Choisissez un mot de passe d’au moins 12 caractères.',
      MOTS_DE_PASSE_DIFFERENTS: 'Les deux mots de passe ne correspondent pas.',
      COMPTE_NON_CREATABLE: 'Cette adresse email est déjà associée à un compte. Connectez-vous ou reprenez la vérification si elle n’est pas terminée.',
      VERIFICATION_NON_LIVREE: 'Le compte a été créé, mais le code n’a pas pu être livré. Utilisez « Renvoyer le code » pour reprendre sur le même compte.',
      LIVRAISON_VERIFICATION_ECHOUEE: 'Le code n’a pas pu être envoyé. Réessayez dans quelques instants.',
      RENVOI_TROP_RAPIDE: 'Un code vient déjà d’être envoyé. Attendez environ une minute avant un nouvel envoi.',
      TROP_DE_RENVOIS: 'Trop de codes ont été demandés. Réessayez plus tard.',
      ORIGINE_REFUSEE: 'Cette demande a été refusée pour des raisons de sécurité. Rechargez la page.',
    };
    return messages[code] || 'Le service est temporairement indisponible. Réessayez dans quelques instants.';
  }

  async function login() {
    const response = await fetch('/api/genesis/account/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error(body.error || 'CONNEXION_INDISPONIBLE');
    router.push('/espace');
    router.refresh();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      if (mode === 'login') {
        await login();
        return;
      }

      if (password.length < 12) throw new Error('MOT_DE_PASSE_TROP_COURT');
      if (password !== confirmPassword) throw new Error('MOTS_DE_PASSE_DIFFERENTS');

      const response = await fetch('/api/genesis/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, identifier, password }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || 'INSCRIPTION_INDISPONIBLE');
      setPending(body.pending);
      setInfo('Un code de vérification vient de vous être envoyé par email.');
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'ERREUR';
      setError(messageFor(errorCode));
      if (errorCode === 'COMPTE_NON_CREATABLE') setMode('login');
    } finally {
      setLoading(false);
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!pending) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/genesis/account/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: pending.identity,
          identifierReference: pending.identifierReference,
          verificationReference: pending.verificationReference,
          code,
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || 'CODE_REFUSE');
      await login();
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'CODE_REFUSE';
      setError(errorCode === 'CODE_REFUSE' || errorCode.startsWith('VERIFICATION_')
        ? 'Code incorrect ou expiré. Vérifiez le code reçu puis réessayez.'
        : messageFor(errorCode));
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!pending) return;
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const response = await fetch('/api/genesis/account/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, identifierReference: pending.identifierReference }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || 'RENVOI_REFUSE');
      setPending((current) => current ? { ...current, verificationReference: body.verification.verificationReference, expiresAt: body.verification.expiresAt } : current);
      setCode('');
      setInfo('Un nouveau code vient de vous être envoyé. L’ancien code n’est plus valable.');
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'RENVOI_REFUSE';
      setError(messageFor(errorCode));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy">
          <ArrowLeft className="h-4 w-4" /> Retour à DG AFRIQUE
        </Link>

        <div className="mt-7 grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[.9fr_1.1fr]">
          <section className="bg-dgNavy p-8 text-white sm:p-10 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><UserRound className="h-6 w-6" /></div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mon espace</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Votre accès personnel à DG AFRIQUE.</h1>
            <p className="mt-5 max-w-lg leading-8 text-slate-300">Créez un compte ou connectez-vous pour disposer d’un accès personnel qui pourra accueillir progressivement les services disponibles pour vous.</p>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dgGold" /> Un identifiant utilisateur simple et unique.</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dgGold" /> Une inscription vérifiée par email.</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dgGold" /> Un espace prêt à recevoir de nouveaux services au fur et à mesure de leur disponibilité.</p>
            </div>
          </section>

          <section className="bg-white">
            {pending ? (
              <form onSubmit={verify} className="mx-auto max-w-xl space-y-5 p-7 sm:p-10 lg:p-12">
                <div><p className="text-xs font-black uppercase tracking-[0.15em] text-dgGold">Vérification</p><h2 className="mt-2 text-3xl font-black text-dgNavy">Vérifiez votre adresse email</h2><p className="mt-3 text-sm leading-6 text-slate-500">Saisissez le code à 6 chiffres envoyé à <strong>{identifier}</strong>.</p></div>
                <input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-2xl font-black tracking-[0.35em] outline-none focus:border-dgNavy" required />
                {info && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{info}</p>}
                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
                <button disabled={loading || code.length !== 6} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Vérifier et continuer</button>
                <button type="button" onClick={resend} disabled={loading} className="w-full text-sm font-black text-dgNavy disabled:opacity-50">Renvoyer le code</button>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-2 border-b border-slate-100 p-2 sm:p-3">
                  {(['login', 'register'] as Mode[]).map((item) => (
                    <button key={item} type="button" onClick={() => { setMode(item); setError(''); setInfo(''); }} className={`rounded-xl px-3 py-3 text-sm font-black ${mode === item ? 'bg-dgNavy text-white' : 'text-slate-500'}`}>{item === 'login' ? 'Se connecter' : 'Créer un compte'}</button>
                  ))}
                </div>

                <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-7 sm:p-10 lg:p-12">
                  <div><p className="text-xs font-black uppercase tracking-[0.15em] text-dgGold">{mode === 'login' ? 'Bienvenue' : 'Inscription'}</p><h2 className="mt-2 text-3xl font-black text-dgNavy">{mode === 'login' ? 'Accéder à mon espace' : 'Créer mon accès personnel'}</h2></div>
                  {mode === 'register' && <div><label className="text-sm font-black text-slate-800">Nom complet</label><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Votre nom" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy" required /></div>}
                  <div><label className="text-sm font-black text-slate-800">Adresse email</label><div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy"><Mail className="h-5 w-5 text-slate-400" /><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type="email" autoComplete="email" placeholder="vous@exemple.com" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" required /></div>{mode === 'register' && <p className="mt-2 text-xs text-slate-400">Un code de vérification sera envoyé à cette adresse.</p>}</div>
                  <div><label className="text-sm font-black text-slate-800">Mot de passe</label><div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy"><KeyRound className="h-5 w-5 text-slate-400" /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Votre mot de passe" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" required /></div>{mode === 'register' && <p className="mt-2 text-xs text-slate-400">12 caractères minimum.</p>}</div>
                  {mode === 'register' && <div><label className="text-sm font-black text-slate-800">Confirmer le mot de passe</label><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Retapez votre mot de passe" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy" required /></div>}
                  {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
                  {info && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{info}</p>}
                  <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white transition hover:opacity-95 disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{loading ? 'Veuillez patienter…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
