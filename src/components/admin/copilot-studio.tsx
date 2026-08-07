'use client';

import { useActionState, useMemo, useState } from 'react';
import { Bot, Check, Copy, LoaderCircle, Sparkles } from 'lucide-react';
import {
  generateCopilotContentAction,
  type CopilotActionState,
} from '@/app/admin/(protected)/copilote/actions';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

const initialState: CopilotActionState = { status: 'idle' };

export type CopilotProviderOption = {
  provider_key: string;
  display_name: string;
  model: string;
  enabled: boolean;
  has_secret: boolean;
};

export function CopilotStudio({
  providers,
  defaultLanguage,
  defaultTone,
}: {
  providers: CopilotProviderOption[];
  defaultLanguage: string;
  defaultTone: string;
}) {
  const [state, action, pending] = useActionState(generateCopilotContentAction, initialState);
  const [copied, setCopied] = useState(false);
  const readyProviders = useMemo(
    () => providers.filter((provider) => provider.enabled && provider.has_secret),
    [providers],
  );

  async function copyResult() {
    if (!state.formatted) return;
    await navigator.clipboard.writeText(state.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-ocean">
            <Sparkles className="h-4 w-4" /> Studio de génération
          </div>
          <h2 className="mt-4 text-2xl font-black text-ink sm:text-3xl">Transformez quelques informations en contenu commercial.</h2>
          <p className="mt-3 leading-7 text-slate-600">Rédigez des fiches produits, articles et publications sociales. Le Copilote utilise uniquement les faits présents dans votre brief.</p>
        </div>
        <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
          <p className="text-xs font-black uppercase tracking-[0.13em] text-cyan">Moteurs prêts</p>
          <p className="mt-1 text-2xl font-black">{readyProviders.length} / {providers.length}</p>
        </div>
      </div>

      {readyProviders.length === 0 ? (
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          <Bot className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Le Studio est installé. Ajoutez une clé API dans la section « Moteurs IA », activez le fournisseur, puis testez la connexion.</p>
        </div>
      ) : null}

      <form action={action} className="mt-8 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
        <div className="space-y-5 rounded-2xl bg-slate-50 p-5">
          <div>
            <label className={labelClass}>Moteur IA</label>
            <select name="provider_key" className={inputClass} disabled={readyProviders.length === 0} required>
              {readyProviders.map((provider) => (
                <option key={provider.provider_key} value={provider.provider_key}>
                  {provider.display_name} — {provider.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Type de contenu</label>
            <select name="content_type" className={inputClass} defaultValue="product">
              <option value="product">Fiche produit ou service</option>
              <option value="article">Article de blog</option>
              <option value="social">Publication sociale</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <label className={labelClass}>Langue</label>
              <select name="language" className={inputClass} defaultValue={defaultLanguage || 'fr'}>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Ton</label>
              <select name="tone" className={inputClass} defaultValue={defaultTone || 'commercial'}>
                <option value="commercial">Commercial</option>
                <option value="pedagogique">Pédagogique</option>
                <option value="professionnel">Professionnel</option>
                <option value="direct">Direct</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Informations validées</label>
          <textarea
            name="brief"
            required
            minLength={20}
            rows={12}
            className={`${inputClass} resize-y leading-7`}
            placeholder="Exemple : AutoCAD, abonnement 1 an, 10 000 FCFA, jusqu’à 3 appareils avec un seul appareil utilisé à la fois. Public : étudiants, techniciens, architectes et ingénieurs. Commande et assistance sur WhatsApp. Formation AutoCAD disponible séparément."
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">Ajoutez uniquement les faits certains : prix, durée, appareils, public, avantages et modalités. Les informations absentes ne seront pas inventées.</p>

          <button
            disabled={pending || readyProviders.length === 0}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {pending ? 'Génération en cours…' : 'Générer le contenu'}
          </button>
        </div>
      </form>

      {state.status === 'error' ? (
        <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-800">{state.message}</div>
      ) : null}

      {state.status === 'success' && state.formatted ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-emerald-800"><Check className="h-4 w-4" /> Contenu généré</p>
              <p className="mt-1 text-xs text-slate-500">{state.provider} · {state.model}</p>
            </div>
            <button type="button" onClick={copyResult} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-ink shadow-sm">
              {copied ? <Check className="h-4 w-4 text-mint" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copié' : 'Copier le contenu'}
            </button>
          </div>
          <textarea readOnly value={state.formatted} rows={24} className="mt-5 w-full resize-y rounded-2xl border border-emerald-100 bg-white p-5 text-sm leading-7 text-slate-800 focus:outline-none" />
        </div>
      ) : null}
    </section>
  );
}
