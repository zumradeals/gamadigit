'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, Loader2, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';

type Mode = 'login' | 'register';
type IdentifierType = 'EMAIL' | 'TELEPHONE';
type Pending = {
  identity: string;
  identifierReference: string;
  verificationReference: string;
  expiresAt: string;
  channel: IdentifierType;
};

export function AccountLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [type, setType] = useState<IdentifierType>('EMAIL');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function login() {
    const response = await fetch('/api/genesis/account/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, type, password }),
    });
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error(body.error || 'CONNEXION_INDISPONIBLE');
    router.push('/genesis/espace');
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
        body: JSON.stringify({ name, identifier, type, password }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || 'INSCRIPTION_INDISPONIBLE');
      setPending(body.pending);
      setInfo(type === 'EMAIL' ? 'Un code de vérification vient de vous être envoyé par email.' : 'Un code de vérification vient de vous être envoyé par SMS.');
    } catch (err) {
      const code = err instanceof Error ? err.message : 'ERREUR';
      const messages: Record<string, string> = {
        IDENTIFIANT_OU_SECRET_REFUSE: 'Adresse, numéro ou mot de passe incorrect.',
        MOT_DE_PASSE_TROP_COURT: 'Choisissez un mot de passe d’au moins 12 caractères.',
        MOTS_DE_PASSE_DIFFERENTS: 'Les deux mots de passe ne correspondent pas.',
        COMPTE_NON_CREATABLE: 'Ce moyen de connexion est déjà utilisé ou ne peut pas servir à créer un compte.',
        LIVRAISON_VERIFICATION_ECHOUEE: 'Le code n’a pas pu être envoyé. Réessayez dans quelques instants.',
      };
      setError(messages[code] || 'Le service est temporairement indisponible. Réessayez dans quelques instants.');
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
    } catch {
      setError('Code incorrect ou expiré. Vérifiez le code reçu puis réessayez.');
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
        body: JSON.stringify({ identifier, type, identifierReference: pending.identifierReference }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || 'RENVOI_REFUSE');
      setPending((current) => current ? { ...current, verificationReference: body.verification.verificationReference, expiresAt: body.verification.expiresAt } : current);
      setInfo('Un nouveau code vient de vous être envoyé. L’ancien code n’est plus valable.');
    } catch {
      setError('Le code ne peut pas encore être renvoyé. Attendez un instant puis réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <Link href="/genesis" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy">
          <ArrowLeft className="h-4 w-4" /> Retour au portail
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="bg-dgNavy px-7 py-8 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-dgGold">
              <UserRound className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-dgGold">DG AFRIQUE</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">Mon espace</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">Un seul compte pour accéder progressivement aux services disponibles sur le portail.</p>
          </div>

          {pending ? (
            <form onSubmit={verify} className="space-y-5 p-7">
              <div>
                <p className="text-sm font-black text-slate-900">Vérifiez votre {type === 'EMAIL' ? 'adresse email' : 'numéro de téléphone'}</p>
                <p className="mt-1 text-sm text-slate-500">Saisissez le code à 6 chiffres que vous venez de recevoir.</p>
              </div>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-2xl font-black tracking-[0.35em] outline-none focus:border-dgNavy"
                required
              />
              {info && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{info}</p>}
              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
              <button disabled={loading || code.length !== 6} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Vérifier et continuer
              </button>
              <button type="button" onClick={resend} disabled={loading} className="w-full text-sm font-black text-dgNavy disabled:opacity-50">Renvoyer le code</button>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 border-b border-slate-100 p-2">
                {(['login', 'register'] as Mode[]).map((item) => (
                  <button key={item} type="button" onClick={() => { setMode(item); setError(''); setInfo(''); }} className={`rounded-xl px-3 py-3 text-sm font-black ${mode === item ? 'bg-dgNavy text-white' : 'text-slate-500'}`}>
                    {item === 'login' ? 'Se connecter' : 'Créer un compte'}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="space-y-5 p-7">
                {mode === 'register' && (
                  <div>
                    <label className="text-sm font-black text-slate-800">Nom complet</label>
                    <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Votre nom" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy" required />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                  <button type="button" onClick={() => setType('EMAIL')} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black ${type === 'EMAIL' ? 'bg-white text-dgNavy shadow-sm' : 'text-slate-500'}`}><Mail className="h-4 w-4" /> Email</button>
                  <button type="button" onClick={() => setType('TELEPHONE')} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black ${type === 'TELEPHONE' ? 'bg-white text-dgNavy shadow-sm' : 'text-slate-500'}`}><Phone className="h-4 w-4" /> Téléphone</button>
                </div>

                <div>
                  <label className="text-sm font-black text-slate-800">{type === 'EMAIL' ? 'Adresse email' : 'Numéro de téléphone'}</label>
                  <input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    type={type === 'EMAIL' ? 'email' : 'tel'}
                    autoComplete={type === 'EMAIL' ? 'email' : 'tel'}
                    placeholder={type === 'EMAIL' ? 'vous@exemple.com' : '+225 07 00 00 00 00'}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-800">Mot de passe</label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy">
                    <KeyRound className="h-5 w-5 text-slate-400" />
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Votre mot de passe" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" required />
                  </div>
                  {mode === 'register' && <p className="mt-2 text-xs text-slate-400">12 caractères minimum.</p>}
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="text-sm font-black text-slate-800">Confirmer le mot de passe</label>
                    <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Retapez votre mot de passe" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy" required />
                  </div>
                )}

                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
                {info && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{info}</p>}

                <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white transition hover:opacity-95 disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {loading ? 'Veuillez patienter…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
