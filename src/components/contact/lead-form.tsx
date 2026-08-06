'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import { families } from '@/lib/content';
import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { whatsappUrl } from '@/lib/site';

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  customerType: string;
  familySlug: string;
  budgetLabel: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  fullName: '',
  phone: '',
  email: '',
  customerType: 'professionnel',
  familySlug: '',
  budgetLabel: '',
  message: '',
  website: '',
};

export function LeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const configured = useMemo(() => isSupabaseConfigured(), []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback('');

    if (form.website) return;
    if (form.fullName.trim().length < 2 || form.phone.trim().length < 6 || form.message.trim().length < 5) {
      setStatus('error');
      setFeedback('Merci de renseigner votre nom, un téléphone valide et une description du projet.');
      return;
    }

    const client = createSupabaseBrowserClient();
    if (!client) {
      setStatus('error');
      setFeedback('Le formulaire sera activé dès la connexion du projet Supabase. WhatsApp reste disponible immédiatement.');
      return;
    }

    setStatus('sending');
    const { error } = await client.from('leads').insert({
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      customer_type: form.customerType || null,
      family_slug: form.familySlug || null,
      budget_label: form.budgetLabel || null,
      message: form.message.trim(),
      source: 'website',
    });

    if (error) {
      setStatus('error');
      setFeedback('La demande n’a pas pu être enregistrée. Vous pouvez continuer directement sur WhatsApp.');
      return;
    }

    setStatus('success');
    setFeedback('Votre demande a bien été enregistrée. Un conseiller vous répondra dès que possible.');
    setForm(initialState);
  }

  const inputClass =
    'focus-ring w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-slate-400';

  return (
    <div className="rounded-3xl bg-white p-7 shadow-soft sm:p-10">
      <h2 className="text-2xl font-black text-ink">Demande de devis</h2>
      <p className="mt-3 leading-7 text-slate-600">
        Donnez-nous les éléments essentiels. Vous pourrez compléter les détails avec un conseiller.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-ink">Nom complet *</label>
            <input id="fullName" value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} className={inputClass} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-bold text-ink">Téléphone / WhatsApp *</label>
            <input id="phone" value={form.phone} onChange={(event) => setField('phone', event.target.value)} className={inputClass} autoComplete="tel" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-ink">E-mail</label>
            <input id="email" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} className={inputClass} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="customerType" className="mb-2 block text-sm font-bold text-ink">Vous êtes</label>
            <select id="customerType" value={form.customerType} onChange={(event) => setField('customerType', event.target.value)} className={inputClass}>
              <option value="particulier">Particulier</option>
              <option value="professionnel">Professionnel / indépendant</option>
              <option value="entreprise">Entreprise / organisation</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="familySlug" className="mb-2 block text-sm font-bold text-ink">Famille de besoin</label>
            <select id="familySlug" value={form.familySlug} onChange={(event) => setField('familySlug', event.target.value)} className={inputClass}>
              <option value="">Je ne sais pas encore</option>
              {families.map((family) => <option key={family.id} value={family.slug}>{family.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="budgetLabel" className="mb-2 block text-sm font-bold text-ink">Budget indicatif</label>
            <select id="budgetLabel" value={form.budgetLabel} onChange={(event) => setField('budgetLabel', event.target.value)} className={inputClass}>
              <option value="">À définir ensemble</option>
              <option value="moins-100k">Moins de 100 000 FCFA</option>
              <option value="100k-300k">100 000 à 300 000 FCFA</option>
              <option value="300k-1m">300 000 à 1 000 000 FCFA</option>
              <option value="plus-1m">Plus de 1 000 000 FCFA</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-bold text-ink">Décrivez votre projet *</label>
          <textarea id="message" rows={6} value={form.message} onChange={(event) => setField('message', event.target.value)} className={`${inputClass} resize-y`} placeholder="Objectif, public, délai souhaité et contraintes éventuelles…" />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Site web</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setField('website', event.target.value)} />
        </div>

        {feedback && (
          <div className={`rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
            <span className="flex items-start gap-2">
              {status === 'success' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              {feedback}
            </span>
          </div>
        )}

        <button type="submit" disabled={status === 'sending'} className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>
      </form>

      <div className="mt-5 border-t border-slate-100 pt-5 text-center">
        <a href={whatsappUrl('Bonjour GamaDigit, je souhaite demander un devis. Mon projet concerne : ')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-black text-mint">
          <MessageCircle className="h-4 w-4" /> Continuer directement sur WhatsApp
        </a>
        {!configured && <p className="mt-3 text-xs text-slate-400">Mode initial : connexion Supabase en attente de configuration.</p>}
      </div>
    </div>
  );
}
