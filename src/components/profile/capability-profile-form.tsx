'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import type { CapabilityProfile } from '@/lib/profile/capability-profile';

function splitList(value: string) {
  return value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
}

type ProfileResponse = {
  ok?: boolean;
  error?: string;
  profile?: CapabilityProfile;
};

export function CapabilityProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [currentActivity, setCurrentActivity] = useState('');
  const [skills, setSkills] = useState('');
  const [noSkillsYet, setNoSkillsYet] = useState(false);
  const [learningGoals, setLearningGoals] = useState('');
  const [sectors, setSectors] = useState('');
  const [intentions, setIntentions] = useState('');
  const [openToRecommendations, setOpenToRecommendations] = useState(true);

  useEffect(() => {
    fetch('/api/genesis/profile', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = '/connexion?next=/espace/profil';
          return null;
        }
        const body = await response.json() as ProfileResponse;
        if (!response.ok || !body.profile) throw new Error(body.error || 'PROFIL_INDISPONIBLE');
        const profile = body.profile;
        setDisplayName(profile.displayName || '');
        setCountry(profile.country || '');
        setCity(profile.city || '');
        setCurrentActivity(profile.currentActivity || '');
        setSkills(profile.skills.join(', '));
        setNoSkillsYet(profile.noSkillsYet);
        setLearningGoals(profile.learningGoals.join(', '));
        setSectors(profile.sectors.join(', '));
        setIntentions(profile.intentions.join(', '));
        setOpenToRecommendations(profile.openToRecommendations);
        return body;
      })
      .catch(() => setError('Votre profil est momentanément indisponible.'))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    const response = await fetch('/api/genesis/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country,
        city,
        currentActivity,
        skills: splitList(skills),
        noSkillsYet,
        learningGoals: splitList(learningGoals),
        sectors: splitList(sectors).slice(0, 12),
        intentions: splitList(intentions).slice(0, 12),
        openToRecommendations,
      }),
    }).catch(() => null);

    if (!response) {
      setError('Impossible de joindre le service. Réessayez.');
      setSaving(false);
      return;
    }

    const body = await response.json().catch(() => ({})) as ProfileResponse;
    if (!response.ok || !body.ok) {
      setError(body.error === 'PROFIL_INVALIDE'
        ? 'Vérifiez les informations saisies.'
        : 'Votre profil n’a pas pu être enregistré. Réessayez.');
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-gold" /> Chargement de votre profil…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-4 pb-20 pt-6 text-ink sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-ink hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Mon espace
          </Link>
        </div>

        <section className="rounded-card border border-line bg-paper-card p-6 sm:p-8">
          <p className="font-mono text-label uppercase tracking-[0.1em] text-gold">Profil de capacités</p>
          <h1 className="mt-3 font-display text-[2.2rem] leading-tight sm:text-[2.8rem]">Ce que vous savez, apprenez et voulez accomplir.</h1>
          <p className="mt-4 max-w-2xl text-body leading-7 text-slate-ink">
            Ce profil appartient à votre compte DG Afrique. Il peut vous aider à être mieux orienté dans l’écosystème, sans vous inscrire automatiquement à ZUMRA et sans vous réduire à une note.
          </p>
        </section>

        {saved && (
          <div className="mt-5 flex items-start gap-3 rounded-tile border border-[#B9DFC9] bg-[#EAF6F0] p-4 text-body font-medium text-[#245E45]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> Votre profil DG Afrique est enregistré.
          </div>
        )}
        {error && <div className="mt-5 rounded-tile border border-red-200 bg-red-50 p-4 text-body font-medium text-red-800">{error}</div>}

        <form onSubmit={submit} className="mt-5 space-y-4">
          <Section title="Votre identité et votre situation" description="Votre nom vient de votre identité DG Afrique. Complétez seulement les éléments utiles à l’orientation.">
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="Nom" value={displayName || 'Compte DG Afrique'} />
              <Field label="Activité actuelle" value={currentActivity} onChange={setCurrentActivity} placeholder="Ex. commerçant, étudiant, artisan…" />
              <Field label="Pays" value={country} onChange={setCountry} placeholder="Ex. Côte d’Ivoire" />
              <Field label="Ville / localité" value={city} onChange={setCity} placeholder="Ex. Abidjan" />
            </div>
          </Section>

          <Section title="Ce que vous savez faire" description="Écrivez simplement vos savoir-faire, séparés par des virgules. L’expérience compte autant que les diplômes.">
            <TextArea value={skills} onChange={setSkills} placeholder="Ex. vente, couture, plomberie, informatique…" disabled={noSkillsYet} />
            <label className="mt-3 flex items-start gap-3 text-body text-slate-ink">
              <input type="checkbox" checked={noSkillsYet} onChange={(event) => setNoSkillsYet(event.target.checked)} className="mt-1" />
              Je commence sans compétence particulière pour le moment.
            </label>
          </Section>

          <Section title="Ce que vous voulez apprendre" description="Ces informations serviront plus tard à vous rapprocher de formations, personnes ou expériences pertinentes.">
            <TextArea value={learningGoals} onChange={setLearningGoals} placeholder="Ex. mécanique, comptabilité, développement web…" />
          </Section>

          <Section title="Vos domaines d’intérêt" description="Indiquez les secteurs ou sujets qui vous attirent.">
            <TextArea value={sectors} onChange={setSectors} placeholder="Ex. agriculture, numérique, commerce, santé…" />
          </Section>

          <Section title="Ce que vous cherchez à accomplir" description="Décrivez vos intentions avec vos propres mots. Elles pourront évoluer avec votre parcours.">
            <TextArea value={intentions} onChange={setIntentions} placeholder="Ex. trouver des partenaires, créer une activité, apprendre un métier…" />
            <label className="mt-3 flex items-start gap-3 text-body text-slate-ink">
              <input type="checkbox" checked={openToRecommendations} onChange={(event) => setOpenToRecommendations(event.target.checked)} className="mt-1" />
              J’accepte que DG Afrique utilise mon profil pour me proposer des orientations pertinentes.
            </label>
          </Section>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer mon profil
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-paper-card p-5 sm:p-6">
      <h2 className="font-display text-[1.45rem]">{title}</h2>
      <p className="mt-1 mb-5 text-body text-slate-ink">{description}</p>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-body font-semibold text-ink">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-tile border border-line-strong bg-paper px-4 py-3 font-normal outline-none focus:border-ink"
      />
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-body font-semibold text-ink">
      {label}
      <div className="mt-2 rounded-tile border border-line bg-paper px-4 py-3 font-normal text-slate-ink">{value}</div>
    </label>
  );
}

function TextArea({ value, onChange, placeholder, disabled = false }: { value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={3}
      className="w-full rounded-tile border border-line-strong bg-paper px-4 py-3 text-body outline-none focus:border-ink disabled:opacity-50"
    />
  );
}
