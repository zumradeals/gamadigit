'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Compass,
  GraduationCap,
  Loader2,
  MapPin,
  Network,
  Phone,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react';
import type { ZumraMePayload } from '@/lib/zumra/types';
import { ZumraMembershipPayment } from '@/components/zumra/zumra-membership-payment';
import { Eyebrow, SuperButton, SuperButtonLink, SuperCard } from '@/components/superapp/ui';

const sectors = [
  ['Agriculture', 'Agriculture'],
  ['Elevage', 'Élevage'],
  ['Commerce', 'Commerce'],
  ['Artisanat', 'Artisanat'],
  ['Batiment', 'Bâtiment'],
  ['Numerique', 'Numérique'],
  ['Education / Formation', 'Éducation / Formation'],
  ['Transport / Logistique', 'Transport / Logistique'],
  ['Environnement', 'Environnement'],
  ['Sante et bien-etre', 'Santé et bien-être'],
  ['Culture', 'Culture'],
  ['Industrie / Production', 'Industrie / Production'],
  ['Services', 'Services'],
  ['Entrepreneuriat', 'Entrepreneuriat'],
] as const;

const intentionOptions = [
  ['join', 'Rejoindre une Zumra', 'Participer à un groupe existant qui correspond à vos intérêts.'],
  ['create', 'Créer une Zumra', 'Rassembler des personnes autour d’un objectif ou d’une activité.'],
  ['recommended', 'Être recommandé à une Zumra', 'Laisser DG Afrique vous orienter lorsque des correspondances réelles existent.'],
  ['learn', 'Commencer par apprendre', 'Développer d’abord des compétences avant de rejoindre une action collective.'],
] as const;

function splitList(value: string) {
  return value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean).slice(0, 20);
}

export function ZumraEnrollmentForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existing, setExisting] = useState<ZumraMePayload | null>(null);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [noSkillsYet, setNoSkillsYet] = useState(false);
  const [learningGoals, setLearningGoals] = useState('');
  const [currentActivity, setCurrentActivity] = useState('');
  const [education, setEducation] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [intentions, setIntentions] = useState<string[]>([]);
  const [participationMode, setParticipationMode] = useState<'physical' | 'digital' | 'both'>('both');
  const [openToRecommendations, setOpenToRecommendations] = useState(true);
  const [charterAccepted, setCharterAccepted] = useState(false);

  useEffect(() => {
    fetch('/api/zumra/me', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = '/connexion';
          return null;
        }
        const body = await response.json() as ZumraMePayload;
        if (!response.ok) throw new Error(body.error || 'ZUMRA_INDISPONIBLE');
        setExisting(body);
        if (body.profile) {
          setCountry(body.profile.country);
          setCity(body.profile.city);
          setPhone(body.profile.phone);
          setSkills(body.profile.skills.join(', '));
          setNoSkillsYet(body.profile.noSkillsYet);
          setLearningGoals(body.profile.learningGoals.join(', '));
          setCurrentActivity(body.profile.currentActivity || '');
          setEducation(body.profile.education || '');
          setSelectedSectors(body.profile.sectors);
          setIntentions(body.profile.intentions);
          setParticipationMode(body.profile.participationMode);
          setOpenToRecommendations(body.profile.openToRecommendations);
          setCharterAccepted(true);
        }
        return body;
      })
      .catch(() => setError('Le Programme ZUMRA est momentanément indisponible.'))
      .finally(() => setLoading(false));
  }, []);

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const response = await fetch('/api/zumra/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country,
        city,
        phone,
        skills: splitList(skills),
        noSkillsYet,
        learningGoals: splitList(learningGoals),
        currentActivity,
        education,
        sectors: selectedSectors,
        intentions,
        participationMode,
        openToRecommendations,
        charterAccepted,
      }),
    }).catch(() => null);

    if (!response) {
      setError('Impossible de joindre le service. Réessayez.');
      setSaving(false);
      return;
    }

    const body = await response.json().catch(() => ({})) as { ok?: boolean; error?: string; paymentRequired?: boolean };
    if (!response.ok || !body.ok) {
      setError(body.error === 'FORMULAIRE_INVALIDE'
        ? 'Vérifiez les champs obligatoires, les secteurs, vos intentions et la Charte.'
        : 'Votre adhésion n’a pas pu être enregistrée. Réessayez.');
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    const refreshed = await fetch('/api/zumra/me', { cache: 'no-store' })
      .then((r) => r.json())
      .catch(() => null) as ZumraMePayload | null;
    if (refreshed) setExisting(refreshed);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 text-body font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-gold" /> Chargement de votre parcours ZUMRA…
        </div>
      </main>
    );
  }

  const status = existing?.membership?.status;
  const active = status === 'active';
  const pendingPayment = status === 'pending_payment';

  return (
    <main className="min-h-screen bg-paper px-4 pb-20 pt-6 text-ink sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto max-w-[73.75rem]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SuperButtonLink as={Link} href="/espace" variant="ghost" size="sm" className="-ml-4 text-slate-ink">
            <ArrowLeft className="h-4 w-4" /> Mon espace
          </SuperButtonLink>
          <span className="text-meta text-slate-muted">Programme ZUMRA</span>
        </div>

        <section className="overflow-hidden rounded-card border border-ink-500/40 bg-ink text-paper">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-10">
            <div>
              <Eyebrow>Votre parcours collectif</Eyebrow>
              <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] font-normal leading-[1.05] tracking-[-0.025em] sm:text-[3rem]">
                Apprendre. Transmettre. Agir ensemble.
              </h1>
              <p className="mt-4 max-w-2xl text-body leading-7 text-ink-200">
                ZUMRA part de ce que vous savez déjà, de ce que vous voulez apprendre et de la manière dont vous souhaitez contribuer. Aucun diplôme n’est nécessaire pour commencer.
              </p>
            </div>

            <div className="self-end rounded-tile border border-ink-500 bg-ink-700 p-5">
              <p className="font-mono text-label uppercase tracking-[0.1em] text-gold-400">Votre situation</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${active ? 'bg-[#4FBF93]' : pendingPayment ? 'bg-gold-400' : 'bg-ink-300'}`} />
                <p className="font-semibold">
                  {active ? 'Adhésion active' : pendingPayment ? 'Dossier enregistré' : existing?.enrolled ? 'Parcours en cours' : 'À démarrer'}
                </p>
              </div>
              <p className="mt-2 text-meta leading-5 text-ink-200">
                {active
                  ? 'Votre profil reste modifiable à tout moment.'
                  : pendingPayment
                    ? 'Le paiement d’adhésion doit encore être confirmé.'
                    : 'Complétez votre profil pour préparer la suite.'}
              </p>
            </div>
          </div>
        </section>

        <JourneySteps active={active} pendingPayment={pendingPayment} enrolled={Boolean(existing?.enrolled)} />

        {success && (
          <div className="mt-5 flex items-start gap-3 rounded-tile border border-[#B9DFC9] bg-[#EAF6F0] p-4 text-body font-medium text-[#245E45]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> Votre profil ZUMRA a bien été enregistré.
          </div>
        )}
        {error && (
          <div className="mt-5 rounded-tile border border-red-200 bg-red-50 p-4 text-body font-medium text-red-800">{error}</div>
        )}

        {pendingPayment && (
          <div className="mt-6">
            <ZumraMembershipPayment />
          </div>
        )}

        <form onSubmit={submit} className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="space-y-4">
            <FormSection
              icon={<MapPin className="h-5 w-5" />}
              eyebrow="01 · Votre situation"
              title="Où êtes-vous et comment vous joindre ?"
              description="Votre nom provient déjà de votre compte DG Afrique. Nous ne vous demandons ici que les informations utiles au parcours ZUMRA."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Pays" value={country} onChange={setCountry} required />
                <Field label="Ville / Localité" value={city} onChange={setCity} required />
                <div className="sm:col-span-2">
                  <Field label="Téléphone" value={phone} onChange={setPhone} required icon={<Phone className="h-4 w-4" />} />
                </div>
              </div>
            </FormSection>

            <FormSection
              icon={<Wrench className="h-5 w-5" />}
              eyebrow="02 · Capacités"
              title="Ce que vous savez faire"
              description="Une compétence peut venir du travail, de la famille, de la pratique ou d’une formation. L’expérience compte."
            >
              <TextArea
                label="Mes compétences"
                value={skills}
                onChange={setSkills}
                placeholder="Ex. plomberie, couture, agriculture, vente, informatique…"
                disabled={noSkillsYet}
              />
              <CheckLine
                checked={noSkillsYet}
                onChange={setNoSkillsYet}
                label="Je commence sans compétence particulière et je souhaite apprendre à partir de zéro."
              />
            </FormSection>

            <FormSection
              icon={<GraduationCap className="h-5 w-5" />}
              eyebrow="03 · Apprentissage"
              title="Ce que vous voulez apprendre"
              description="Ces objectifs permettront progressivement de vous orienter vers des formations, des personnes et des actions pertinentes."
            >
              <TextArea
                label="Mes objectifs d’apprentissage"
                value={learningGoals}
                onChange={setLearningGoals}
                placeholder="Ex. mécanique, gestion, développement web…"
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Activité actuelle" value={currentActivity} onChange={setCurrentActivity} optional />
                <Field label="Formation / diplôme" value={education} onChange={setEducation} optional />
              </div>
            </FormSection>

            <FormSection
              icon={<Compass className="h-5 w-5" />}
              eyebrow="04 · Domaines"
              title="Les secteurs qui vous intéressent"
              description="Choisissez un ou plusieurs domaines. Vous pourrez les modifier plus tard."
            >
              <div className="flex flex-wrap gap-2">
                {sectors.map(([value, label]) => {
                  const selected = selectedSectors.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggle(selectedSectors, value, setSelectedSectors)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selected
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line-strong bg-paper text-slate-ink hover:border-ink'}`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />} {label}
                    </button>
                  );
                })}
              </div>
            </FormSection>

            <FormSection
              icon={<Network className="h-5 w-5" />}
              eyebrow="05 · Intention"
              title="Comment souhaitez-vous participer ?"
              description="ZUMRA peut être un chemin d’apprentissage, un groupe à rejoindre ou une initiative à construire."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {intentionOptions.map(([value, label, description]) => {
                  const selected = intentions.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggle(intentions, value, setIntentions)}
                      className={`rounded-tile border p-4 text-left transition-colors ${selected
                        ? 'border-gold bg-[#FBF5E8]'
                        : 'border-line bg-paper hover:border-line-strong'}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-gold bg-gold text-white' : 'border-line-strong'}`}>
                          {selected && <Check className="h-3 w-3" />}
                        </span>
                        <span>
                          <span className="block text-body font-semibold text-ink">{label}</span>
                          <span className="mt-1 block text-meta leading-5 text-slate-muted">{description}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <label className="mt-5 block text-body font-semibold text-ink">
                Mode de participation préféré
                <select
                  value={participationMode}
                  onChange={(e) => setParticipationMode(e.target.value as 'physical' | 'digital' | 'both')}
                  className="mt-2 w-full rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition focus:border-ink"
                >
                  <option value="physical">En présentiel</option>
                  <option value="digital">100 % numérique</option>
                  <option value="both">Les deux</option>
                </select>
              </label>

              <CheckLine
                checked={openToRecommendations}
                onChange={setOpenToRecommendations}
                label="J’accepte d’être recommandé à une Zumra lorsque mon profil correspond réellement à un besoin ou à un groupe."
              />
            </FormSection>

            <FormSection
              icon={<Sparkles className="h-5 w-5" />}
              eyebrow="06 · Engagement"
              title="Un cadre commun pour agir ensemble"
              description="Le partage de connaissance, l’entraide et l’action collective sont au centre du programme."
            >
              <div className="rounded-tile border border-gold-line bg-[#FBF7EE] p-5 text-body leading-7 text-slate-ink">
                Une Zumra peut commencer avec peu de moyens et progresser par la formation, la transmission, l’organisation et l’action. Votre profil sert à mieux comprendre ce que vous pouvez apporter et ce dont vous avez besoin.
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 text-body text-slate-ink">
                <input
                  required
                  type="checkbox"
                  checked={charterAccepted}
                  onChange={(e) => setCharterAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  J’ai lu et j’accepte la{' '}
                  <Link href="/programme-zumra/charte" target="_blank" className="font-semibold text-gold underline underline-offset-2">
                    Charte des Zumra
                  </Link>.
                </span>
              </label>
            </FormSection>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <SuperCard>
              <Eyebrow tone="muted">Votre dossier</Eyebrow>
              <h2 className="mt-3 font-display text-[1.45rem] font-normal">Un seul profil, évolutif</h2>
              <p className="mt-2 text-body leading-6 text-slate-ink">
                Vous pourrez revenir modifier vos compétences, vos objectifs et vos secteurs. L’enregistrement du profil ne vaut pas encore activation de l’adhésion.
              </p>

              <div className="mt-5 space-y-3 text-meta text-slate-muted">
                <MiniFact icon={<UserRound className="h-4 w-4" />} text="Identité déjà reliée à votre compte DG Afrique" />
                <MiniFact icon={<Network className="h-4 w-4" />} text="Réseau accessible après activation de l’adhésion" />
                <MiniFact icon={<Sparkles className="h-4 w-4" />} text="Recommandations uniquement à partir de données réelles" />
              </div>

              <SuperButton type="submit" size="lg" disabled={saving} className="mt-6 w-full">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {existing?.enrolled ? 'Enregistrer mes modifications' : 'Enregistrer mon profil'}
              </SuperButton>
            </SuperCard>

            {active && (
              <SuperCard tone="dark">
                <Eyebrow>Adhésion active</Eyebrow>
                <p className="mt-3 text-body leading-6 text-ink-200">Votre prochaine étape se trouve désormais dans le réseau ZUMRA.</p>
                <SuperButtonLink as={Link} href="/espace/zumra/reseau" variant="onDark" className="mt-5 w-full">
                  Ouvrir le réseau
                </SuperButtonLink>
              </SuperCard>
            )}
          </aside>
        </form>
      </div>
    </main>
  );
}

function JourneySteps({ active, pendingPayment, enrolled }: { active: boolean; pendingPayment: boolean; enrolled: boolean }) {
  const steps = [
    { label: 'Profil', detail: enrolled ? 'Enregistré' : 'À compléter', done: enrolled, current: !enrolled },
    { label: 'Adhésion', detail: active ? 'Active' : pendingPayment ? 'Paiement à finaliser' : 'Après le profil', done: active, current: pendingPayment },
    { label: 'Réseau', detail: active ? 'Accessible' : 'Après activation', done: false, current: active },
  ];

  return (
    <section className="mt-4 grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.label} className={`rounded-tile border px-4 py-3 ${step.current ? 'border-gold bg-[#FBF7EE]' : 'border-line bg-paper-card'}`}>
          <div className="flex items-center gap-3">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step.done ? 'bg-[#2F7D5A] text-white' : step.current ? 'bg-gold text-white' : 'bg-paper text-slate-muted'}`}>
              {step.done ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <div>
              <p className="text-body font-semibold text-ink">{step.label}</p>
              <p className="text-meta text-slate-muted">{step.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function FormSection({ icon, eyebrow, title, description, children }: { icon: ReactNode; eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <SuperCard className="p-0 sm:p-0">
      <div className="border-b border-line p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-paper text-gold">{icon}</span>
          <div>
            <Eyebrow tone="muted">{eyebrow}</Eyebrow>
            <h2 className="mt-2 font-display text-[1.55rem] font-normal leading-tight">{title}</h2>
            <p className="mt-2 max-w-2xl text-body leading-6 text-slate-ink">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </SuperCard>
  );
}

function Field({ label, value, onChange, required = false, optional = false, icon }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; optional?: boolean; icon?: ReactNode }) {
  return (
    <label className="block text-body font-semibold text-ink">
      <span className="flex items-center gap-2">{icon}{label}{optional && <span className="text-meta font-normal text-slate-muted">facultatif</span>}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition placeholder:text-slate-muted focus:border-ink"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, disabled = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <label className="block text-body font-semibold text-ink">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={4}
        className="mt-2 w-full resize-y rounded-tile border border-line-strong bg-paper px-4 py-3 text-body font-medium outline-none transition placeholder:text-slate-muted focus:border-ink disabled:cursor-not-allowed disabled:bg-paper-card disabled:text-slate-muted"
      />
      <span className="mt-1.5 block text-meta font-normal text-slate-muted">Séparez plusieurs éléments par une virgule.</span>
    </label>
  );
}

function CheckLine({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-tile border border-line bg-paper p-4 text-body text-slate-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}

function MiniFact({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="flex items-start gap-2.5"><span className="mt-0.5 text-gold">{icon}</span><span>{text}</span></div>;
}
