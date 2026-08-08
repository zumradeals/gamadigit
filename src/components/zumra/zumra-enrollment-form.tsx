'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Network, Sparkles } from 'lucide-react';
import type { ZumraMePayload } from '@/lib/zumra/types';
import { ZumraMembershipPayment } from '@/components/zumra/zumra-membership-payment';

const sectors = [
  'Agriculture', 'Elevage', 'Commerce', 'Artisanat', 'Batiment', 'Numerique',
  'Education / Formation', 'Transport / Logistique', 'Environnement',
  'Sante et bien-etre', 'Culture', 'Industrie / Production', 'Services', 'Entrepreneuriat',
];

const intentionOptions = [
  ['join', 'Rejoindre une Zumra'],
  ['create', 'Creer une Zumra'],
  ['recommended', 'Etre recommande a une Zumra'],
  ['learn', 'Commencer par apprendre / me former'],
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
      .catch(() => setError('Le Programme ZUMRA est momentanement indisponible.'))
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
        country, city, phone,
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
      setError('Impossible de joindre le service. Reessayez.');
      setSaving(false);
      return;
    }

    const body = await response.json().catch(() => ({})) as { ok?: boolean; error?: string; paymentRequired?: boolean };
    if (!response.ok || !body.ok) {
      setError(body.error === 'FORMULAIRE_INVALIDE'
        ? 'Verifiez les champs obligatoires, les secteurs, vos intentions et la Charte.'
        : 'Votre adhesion n’a pas pu etre enregistree. Reessayez.');
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    const refreshed = await fetch('/api/zumra/me', { cache: 'no-store' }).then((r) => r.json()).catch(() => null) as ZumraMePayload | null;
    if (refreshed) setExisting(refreshed);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50"><div className="flex items-center gap-3 font-black text-dgNavy"><Loader2 className="h-5 w-5 animate-spin" /> Chargement du Programme ZUMRA…</div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Retour a Mon espace</Link>

        <section className="mt-7 overflow-hidden rounded-[2rem] bg-dgNavy p-7 text-white shadow-xl sm:p-10">
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><Network className="h-6 w-6" /></div><div><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Programme ZUMRA</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Apprendre · Transmettre · Agir</h1><p className="mt-3 max-w-2xl leading-7 text-slate-300">Aucun diplome n’est exige. Dites-nous ce que vous savez faire, ce que vous souhaitez apprendre et la facon dont vous aimeriez participer.</p></div></div>
        </section>

        {existing?.coreIdentityReference && <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm"><span className="font-bold text-slate-500">Votre identite :</span> <span className="break-all font-black text-dgNavy">{existing.coreIdentityReference}</span></div>}

        {existing?.membership?.status === 'active' && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800">Votre adhesion ZUMRA est active. Vous pouvez utiliser ce formulaire pour mettre votre profil a jour.</div>}
        {existing?.membership?.status === 'pending_payment' && <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-900">Votre dossier est enregistre. Finalisez maintenant l’adhesion dans le sandbox GeniusPay pour activer votre Carte ZUMRA.</div>}
        {success && <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> Votre profil ZUMRA a bien ete enregistre.</div>}
        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-6">
          <Section title="1. Votre situation" subtitle="Votre nom et votre ID viennent deja de votre compte DG AFRIQUE.">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Pays *" value={country} onChange={setCountry} /><Field label="Ville / Localite *" value={city} onChange={setCity} /><Field label="Telephone *" value={phone} onChange={setPhone} /></div>
          </Section>

          <Section title="2. Ce que vous savez et voulez apprendre" subtitle="L’experience compte autant que les diplomes.">
            <TextArea label="Que savez-vous faire ?" value={skills} onChange={setSkills} placeholder="Plomberie, couture, agriculture, vente, informatique…" disabled={noSkillsYet} />
            <label className="mt-3 flex items-start gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={noSkillsYet} onChange={(e) => setNoSkillsYet(e.target.checked)} className="mt-1" /> Je n’ai pas encore de competence particuliere, je souhaite apprendre a partir de zero.</label>
            <div className="mt-4"><TextArea label="Que souhaitez-vous apprendre ?" value={learningGoals} onChange={setLearningGoals} placeholder="Mecanique, gestion, developpement web…" /></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Activite actuelle (facultatif)" value={currentActivity} onChange={setCurrentActivity} /><Field label="Formation / diplome (facultatif)" value={education} onChange={setEducation} /></div>
          </Section>

          <Section title="3. Vos domaines d’interet" subtitle="Choisissez un ou plusieurs secteurs.">
            <div className="flex flex-wrap gap-2">{sectors.map((sector) => <button key={sector} type="button" onClick={() => toggle(selectedSectors, sector, setSelectedSectors)} className={`rounded-full border px-4 py-2 text-sm font-bold ${selectedSectors.includes(sector) ? 'border-dgGreen bg-dgGreen text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>{sector}</button>)}</div>
          </Section>

          <Section title="4. Comment souhaitez-vous participer ?" subtitle="Une Zumra peut etre locale, numerique ou hybride.">
            <div className="grid gap-3 sm:grid-cols-2">{intentionOptions.map(([value, label]) => <label key={value} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700"><input type="checkbox" checked={intentions.includes(value)} onChange={() => toggle(intentions, value, setIntentions)} className="mt-1" /> {label}</label>)}</div>
            <label className="mt-5 block text-sm font-black text-slate-700">Mode prefere<select value={participationMode} onChange={(e) => setParticipationMode(e.target.value as 'physical' | 'digital' | 'both')} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none focus:border-dgGreen"><option value="physical">Physique</option><option value="digital">100 % numerique</option><option value="both">Les deux</option></select></label>
            <label className="mt-4 flex items-start gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={openToRecommendations} onChange={(e) => setOpenToRecommendations(e.target.checked)} className="mt-1" /> J’accepte d’etre recommande a une Zumra correspondant a mon profil.</label>
          </Section>

          <Section title="5. Votre engagement" subtitle="Le partage de connaissance est un principe central de ZUMRA.">
            <div className="rounded-2xl bg-dgIvory p-5 text-sm leading-7 text-slate-700"><Sparkles className="mb-3 h-5 w-5 text-dgGold" /> Une Zumra apprend, transmet et travaille ensemble. Elle peut commencer sans competence particuliere et progresser par la formation, l’entraide et l’action.</div>
            <label className="mt-4 flex items-start gap-3 text-sm font-bold text-slate-700"><input required type="checkbox" checked={charterAccepted} onChange={(e) => setCharterAccepted(e.target.checked)} className="mt-1" /> <span>J’ai lu et j’accepte la <Link href="/programme-zumra/charte" target="_blank" className="text-dgGreen underline">Charte des Zumra</Link>.</span></label>
          </Section>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8"><p className="font-black text-dgNavy">Adhesion au Programme ZUMRA</p><p className="mt-2 text-sm leading-6 text-slate-600">Enregistrez votre dossier. Tant que l’adhesion n’est pas active, le paiement d’adhesion GeniusPay reste une etape separee et verifiee cote serveur.</p><button disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dgGreen px-5 py-4 text-sm font-black text-white disabled:opacity-60 sm:w-auto">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{existing?.enrolled ? 'Enregistrer mes modifications' : 'Enregistrer ma demande d’adhesion'}</button></div>
        </form>

        {existing?.membership?.status === 'pending_payment' && <div className="mt-6"><ZumraMembershipPayment /></div>}
      </div>
    </main>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-black text-dgNavy">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p><div className="mt-6">{children}</div></section>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-black text-slate-700">{label}<input required={label.includes('*')} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-dgGreen" /></label>;
}

function TextArea({ label, value, onChange, placeholder, disabled = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean }) {
  return <label className="block text-sm font-black text-slate-700">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-dgGreen disabled:bg-slate-100 disabled:text-slate-400" /></label>;
}
