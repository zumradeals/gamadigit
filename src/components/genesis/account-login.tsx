'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import {
  makePendingAccountVerification,
  normalizePendingAccountVerification,
  pendingVerificationCodeIsActive,
  type PendingAccountVerification,
} from '@/lib/gamad-core/account-flow';

type Mode = 'login' | 'register';
type Captcha = {
  question: string;
  token: string;
  expiresAt: string;
};

type PendingFromApi = Omit<PendingAccountVerification, 'identifier' | 'resumeUntil'>;

const PENDING_STORAGE_KEY = 'dgafrique_pending_account_verification_v1';

function messageFor(code: string) {
  const messages: Record<string, string> = {
    IDENTIFIANT_OU_SECRET_REFUSE: 'Adresse email ou mot de passe incorrect.',
    MOT_DE_PASSE_TROP_COURT: 'Choisissez un mot de passe d’au moins 6 caractères.',
    MOTS_DE_PASSE_DIFFERENTS: 'Les deux mots de passe ne correspondent pas.',
    CAPTCHA_INCORRECT: 'Le calcul de sécurité est incorrect. Réessayez.',
    CAPTCHA_INDISPONIBLE: 'La vérification de sécurité est momentanément indisponible. Réessayez.',
    COMPTE_NON_CREATABLE: 'Cette adresse email est déjà associée à un compte. Connectez-vous si elle a déjà été vérifiée.',
    VERIFICATION_NON_LIVREE: 'Votre compte a bien été créé, mais le premier code n’a pas pu être livré. Utilisez « Renvoyer le code » pour continuer avec ce même compte.',
    LIVRAISON_VERIFICATION_ECHOUEE: 'Le nouveau code n’a pas pu être envoyé. Réessayez dans quelques instants.',
    RENVOI_TROP_RAPIDE: 'Un code vient déjà d’être émis. Attendez environ une minute avant un nouvel envoi.',
    LIMITE_RENVOI_ATTEINTE: 'Trop de codes ont été demandés. Réessayez plus tard.',
    TROP_DE_TENTATIVES: 'Trop de codes incorrects ont été saisis. Demandez un nouveau code.',
    VERIFICATION_EXPIREE: 'Ce code a expiré. Demandez un nouveau code.',
    CODE_INVALIDE: 'Le code saisi est incorrect.',
    IDENTIFIANT_DEJA_VERIFIE: 'Cette adresse est déjà vérifiée. Vous pouvez vous connecter.',
    DESTINATION_INCORRECTE: 'Cette vérification ne correspond plus à cette adresse. Utilisez une autre adresse ou contactez le support.',
    RENVOI_NON_AUTORISE: 'Cette vérification ne peut plus être reprise depuis ce parcours.',
    ORIGINE_REFUSEE: 'Cette demande a été refusée pour des raisons de sécurité. Rechargez la page.',
    TROP_DE_TENTATIVES_CONNEXION: 'Trop de tentatives de connexion. Attendez un moment avant de réessayer.',
  };
  return messages[code] || 'Le service est temporairement indisponible. Réessayez dans quelques instants.';
}

function persistPending(pending: PendingAccountVerification | null) {
  try {
    if (pending) localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));
    else localStorage.removeItem(PENDING_STORAGE_KEY);
  } catch {
    // La reprise locale améliore l'UX mais ne doit jamais bloquer le compte.
  }
}

export function AccountLogin({ returnPath = '/espace' }: { returnPath?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [code, setCode] = useState('');
  const [pending, setPending] = useState<PendingAccountVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaAnswer('');
    try {
      const response = await fetch('/api/genesis/account/captcha', { cache: 'no-store' });
      const body = (await response.json()) as { ok?: boolean; captcha?: Captcha; error?: string };
      if (!response.ok || !body.ok || !body.captcha) throw new Error(body.error || 'CAPTCHA_INDISPONIBLE');
      setCaptcha(body.captcha);
    } catch {
      setCaptcha(null);
      setError(messageFor('CAPTCHA_INDISPONIBLE'));
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_STORAGE_KEY);
      if (!raw) return;
      const restored = normalizePendingAccountVerification(JSON.parse(raw));
      if (!restored) {
        localStorage.removeItem(PENDING_STORAGE_KEY);
        return;
      }
      setIdentifier(restored.identifier);
      setPending(restored);
      setMode('register');
      setInfo(
        pendingVerificationCodeIsActive(restored)
          ? 'Votre vérification en cours a été reprise.'
          : 'Votre précédent code a expiré. Demandez un nouveau code pour continuer avec ce même compte.',
      );
    } catch {
      try { localStorage.removeItem(PENDING_STORAGE_KEY); } catch { /* noop */ }
    }
  }, []);

  useEffect(() => {
    if (mode === 'register' && !pending) void loadCaptcha();
  }, [loadCaptcha, mode, pending]);

  function rememberPending(apiPending: PendingFromApi, destination: string) {
    const next = normalizePendingAccountVerification(
      makePendingAccountVerification({ ...apiPending, identifier: destination }),
    );
    if (!next) throw new Error('VERIFICATION_INCOMPLETE');
    setPending(next);
    setIdentifier(destination);
    persistPending(next);
    return next;
  }

  function forgetPending() {
    setPending(null);
    setCode('');
    persistPending(null);
  }

  async function login() {
    const response = await fetch('/api/genesis/account/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error(body.error || 'CONNEXION_INDISPONIBLE');
    router.push(returnPath);
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

      if (password.length < 6) throw new Error('MOT_DE_PASSE_TROP_COURT');
      if (password !== confirmPassword) throw new Error('MOTS_DE_PASSE_DIFFERENTS');
      if (!captcha || !captchaAnswer.trim()) throw new Error('CAPTCHA_INCORRECT');

      const destination = identifier.trim();
      const response = await fetch('/api/genesis/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          identifier: destination,
          password,
          captchaToken: captcha.token,
          captchaAnswer,
        }),
      });
      const body = await response.json() as { ok?: boolean; error?: string; pending?: PendingFromApi };

      if (!response.ok || !body.ok) {
        if (body.error === 'VERIFICATION_NON_LIVREE' && body.pending) {
          rememberPending(body.pending, destination);
          setError(messageFor('VERIFICATION_NON_LIVREE'));
          return;
        }
        throw new Error(body.error || 'INSCRIPTION_INDISPONIBLE');
      }

      if (!body.pending) throw new Error('VERIFICATION_INCOMPLETE');
      rememberPending(body.pending, destination);
      setInfo('Un code de vérification vient de vous être envoyé par email.');
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'ERREUR';
      setError(messageFor(errorCode));
      if (errorCode === 'COMPTE_NON_CREATABLE') setMode('login');
      if (mode === 'register' && errorCode === 'CAPTCHA_INCORRECT') void loadCaptcha();
    } finally {
      setLoading(false);
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!pending) return;
    setLoading(true);
    setError('');
    setInfo('');

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
      const body = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) throw new Error(body.error || 'CODE_REFUSE');

      forgetPending();
      setMode('login');
      setInfo('Adresse vérifiée. Connexion à votre espace…');
      await login();
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'CODE_REFUSE';
      if (errorCode === 'VERIFICATION_EXPIREE' || errorCode === 'TROP_DE_TENTATIVES') {
        setError(messageFor(errorCode));
      } else if (errorCode === 'CODE_REFUSE' || errorCode.startsWith('VERIFICATION_') || errorCode === 'CODE_INVALIDE') {
        setError(errorCode === 'CODE_INVALIDE' ? messageFor(errorCode) : 'Code incorrect ou expiré. Vérifiez le code reçu puis réessayez.');
      } else {
        setError(messageFor(errorCode));
      }
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
        body: JSON.stringify({
          destination: pending.identifier,
          identifierReference: pending.identifierReference,
        }),
      });
      const body = await response.json() as {
        ok?: boolean;
        error?: string;
        verification?: { verificationReference?: string; expiresAt?: string };
      };
      if (!response.ok || !body.ok || !body.verification?.verificationReference || !body.verification.expiresAt) {
        throw new Error(body.error || 'RENVOI_REFUSE');
      }

      const next = makePendingAccountVerification({
        ...pending,
        verificationReference: body.verification.verificationReference,
        expiresAt: body.verification.expiresAt,
      });
      setPending(next);
      persistPending(next);
      setCode('');
      setInfo('Un nouveau code vient de vous être envoyé. L’ancien code n’est plus valable.');
    } catch (err) {
      const errorCode = err instanceof Error ? err.message : 'RENVOI_REFUSE';
      if (errorCode === 'IDENTIFIANT_DEJA_VERIFIE') {
        forgetPending();
        setMode('login');
        setInfo(messageFor(errorCode));
      } else {
        setError(messageFor(errorCode));
      }
    } finally {
      setLoading(false);
    }
  }

  function useAnotherAccount() {
    forgetPending();
    setMode('login');
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setInfo('');
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
            <p className="mt-5 max-w-lg leading-8 text-slate-300">Créez gratuitement votre compte ou connectez-vous. Le compte vous ouvre votre espace personnel sans vous inscrire automatiquement à un programme.</p>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dgGold" /> Une seule porte d’accès personnelle.</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dgGold" /> Une adresse email vérifiée avant la première connexion.</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dgGold" /> Votre compte DG Afrique reste distinct de l’adhésion ZUMRA.</p>
            </div>
          </section>

          <section className="bg-white">
            {pending ? (
              <form onSubmit={verify} className="mx-auto max-w-xl space-y-5 p-7 sm:p-10 lg:p-12">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-dgGold">Vérification</p>
                  <h2 className="mt-2 text-3xl font-black text-dgNavy">Vérifiez votre adresse email</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">Saisissez le code à 6 chiffres envoyé à <strong>{pending.identifier}</strong>.</p>
                  {!pendingVerificationCodeIsActive(pending) && (
                    <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">Le dernier code a expiré. Demandez-en un nouveau ci-dessous.</p>
                  )}
                </div>
                <input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-center text-2xl font-black tracking-[0.35em] outline-none focus:border-dgNavy" required />
                {info && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{info}</p>}
                {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
                <button disabled={loading || code.length !== 6} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Vérifier et continuer</button>
                <button type="button" onClick={resend} disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-dgNavy disabled:opacity-50"><RefreshCw className="h-4 w-4" /> Renvoyer le code</button>
                <button type="button" onClick={useAnotherAccount} disabled={loading} className="w-full text-sm font-bold text-slate-500 disabled:opacity-50">Utiliser une autre adresse</button>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-2 border-b border-slate-100 p-2 sm:p-3">
                  {(['login', 'register'] as Mode[]).map((item) => (
                    <button key={item} type="button" onClick={() => { setMode(item); setError(''); setInfo(''); }} className={`rounded-xl px-3 py-3 text-sm font-black ${mode === item ? 'bg-dgNavy text-white' : 'text-slate-500'}`}>{item === 'login' ? 'Se connecter' : 'Créer un compte'}</button>
                  ))}
                </div>

                <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-7 sm:p-10 lg:p-12">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-dgGold">{mode === 'login' ? 'Bienvenue' : 'Inscription gratuite'}</p>
                    <h2 className="mt-2 text-3xl font-black text-dgNavy">{mode === 'login' ? 'Accéder à mon espace' : 'Créer mon accès personnel'}</h2>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="text-sm font-black text-slate-800">Nom complet</label>
                      <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Votre nom" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy" required />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-black text-slate-800">Adresse email</label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type="email" autoComplete="email" placeholder="vous@exemple.com" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" required />
                    </div>
                    {mode === 'register' && <p className="mt-2 text-xs text-slate-400">Un code de vérification sera envoyé à cette adresse.</p>}
                  </div>

                  <div>
                    <label className="text-sm font-black text-slate-800">Mot de passe</label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy">
                      <KeyRound className="h-5 w-5 text-slate-400" />
                      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'register' ? 6 : undefined} placeholder="Votre mot de passe" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" required />
                    </div>
                    {mode === 'register' && <p className="mt-2 text-xs text-slate-400">6 caractères minimum selon le contrat Core actuel.</p>}
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="text-sm font-black text-slate-800">Confirmer le mot de passe</label>
                      <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={6} placeholder="Retapez votre mot de passe" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm outline-none focus:border-dgNavy" required />
                    </div>
                  )}

                  {mode === 'register' && (
                    <div>
                      <label className="text-sm font-black text-slate-800">Vérification rapide</label>
                      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-dgNavy">
                          <span className="shrink-0 text-sm font-black text-dgNavy">{captchaLoading ? 'Calcul…' : captcha?.question ?? 'Indisponible'}</span>
                          <input value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="Réponse" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none" required />
                        </div>
                        <button type="button" onClick={loadCaptcha} disabled={captchaLoading} aria-label="Changer le calcul" className="flex h-full min-h-12 items-center justify-center rounded-2xl border border-slate-200 px-4 text-dgNavy disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${captchaLoading ? 'animate-spin' : ''}`} /></button>
                      </div>
                    </div>
                  )}

                  {info && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{info}</p>}
                  {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

                  <button disabled={loading || (mode === 'register' && (!captcha || captchaLoading))} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-dgNavy px-5 py-4 text-sm font-black text-white disabled:opacity-60">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'login' ? <KeyRound className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                    {mode === 'login' ? 'Se connecter' : 'Créer gratuitement mon compte'}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
