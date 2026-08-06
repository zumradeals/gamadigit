import { Save } from 'lucide-react';
import { saveHomepageSectionAction } from '@/app/admin/(protected)/accueil/actions';
import {
  defaultHomepageContent,
  getAllHomepageSections,
  type HomepageContent,
} from '@/lib/homepage';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

function SectionMeta({ sectionKey, sortOrder, status }: { sectionKey: string; sortOrder: number; status: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="sectionKey" value={sectionKey} />
      <div><label className={labelClass}>Ordre</label><input name="sortOrder" type="number" defaultValue={sortOrder} className={inputClass} /></div>
      <div><label className={labelClass}>Statut</label><select name="status" defaultValue={status} className={inputClass}><option value="draft">Brouillon</option><option value="published">Publié</option><option value="archived">Archivé</option></select></div>
    </div>
  );
}

function SubmitButton() {
  return <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer cette section</button>;
}

export default async function AdminHomepagePage() {
  const rows = await getAllHomepageSections();
  const content: HomepageContent = structuredClone(defaultHomepageContent);
  const meta = new Map<string, { sortOrder: number; status: string }>();

  for (const row of rows) {
    meta.set(row.section_key, { sortOrder: row.sort_order, status: row.status });
    const payload = row.payload && typeof row.payload === 'object' ? row.payload : {};
    if (row.section_key === 'hero') Object.assign(content.hero, payload);
    if (row.section_key === 'promises') Object.assign(content.promises, payload);
    if (row.section_key === 'process') Object.assign(content.process, payload);
    if (row.section_key === 'families_intro') Object.assign(content.familiesIntro, payload);
    if (row.section_key === 'offers_intro') Object.assign(content.offersIntro, payload);
    if (row.section_key === 'blog_intro') Object.assign(content.blogIntro, payload);
    if (row.section_key === 'final_cta') Object.assign(content.finalCta, payload);
  }

  const sectionMeta = (key: string, fallbackOrder: number) =>
    meta.get(key) || { sortOrder: fallbackOrder, status: 'published' };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Contenus et pages</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Page d’accueil</h1>
      <p className="mt-3 max-w-3xl text-slate-600">Modifiez les textes, les boutons, les promesses et le parcours affichés sur l’accueil sans toucher au code.</p>

      <div className="mt-8 space-y-5">
        <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Bannière principale</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="hero" {...sectionMeta('hero', 10)} />
            <div><label className={labelClass}>Badge</label><input name="badge" defaultValue={content.hero.badge} required className={inputClass} /></div>
            <div><label className={labelClass}>Grand titre</label><input name="title" defaultValue={content.hero.title} required className={inputClass} /></div>
            <div><label className={labelClass}>Partie du titre à mettre en couleur</label><input name="highlight" defaultValue={content.hero.highlight} className={inputClass} /></div>
            <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={content.hero.description} required rows={4} className={inputClass} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Bouton principal</label><input name="primaryLabel" defaultValue={content.hero.primaryLabel} required className={inputClass} /></div><div><label className={labelClass}>Bouton secondaire</label><input name="secondaryLabel" defaultValue={content.hero.secondaryLabel} required className={inputClass} /></div></div>
            <div><label className={labelClass}>Message WhatsApp du bouton principal</label><textarea name="primaryMessage" defaultValue={content.hero.primaryMessage} required rows={3} className={inputClass} /></div>
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Promesses sous les boutons</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="promises" {...sectionMeta('promises', 20)} />
            <div><label className={labelClass}>Une promesse par ligne</label><textarea name="items" defaultValue={content.promises.items.join('\n')} required rows={5} className={inputClass} /></div>
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Méthode en trois étapes</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="process" {...sectionMeta('process', 30)} />
            <div><label className={labelClass}>Petit titre</label><input name="eyebrow" defaultValue={content.process.eyebrow} required className={inputClass} /></div>
            <div><label className={labelClass}>Titre</label><input name="title" defaultValue={content.process.title} required className={inputClass} /></div>
            <div className="space-y-4">
              {content.process.steps.map((step, index) => (
                <div key={`${step.number}-${index}`} className="grid gap-3 rounded-xl bg-cloud p-4 sm:grid-cols-[5rem_.7fr_1.3fr]">
                  <div><label className={labelClass}>N°</label><input name="stepNumber" defaultValue={step.number} className={inputClass} /></div>
                  <div><label className={labelClass}>Étape</label><input name="stepTitle" defaultValue={step.title} required className={inputClass} /></div>
                  <div><label className={labelClass}>Explication</label><input name="stepText" defaultValue={step.text} required className={inputClass} /></div>
                </div>
              ))}
            </div>
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Introduction des six familles</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="families_intro" {...sectionMeta('families_intro', 40)} />
            <div><label className={labelClass}>Petit titre</label><input name="eyebrow" defaultValue={content.familiesIntro.eyebrow} required className={inputClass} /></div>
            <div><label className={labelClass}>Titre</label><input name="title" defaultValue={content.familiesIntro.title} required className={inputClass} /></div>
            <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={content.familiesIntro.description} required rows={4} className={inputClass} /></div>
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Introduction des offres en vedette</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="offers_intro" {...sectionMeta('offers_intro', 50)} />
            <div><label className={labelClass}>Petit titre</label><input name="eyebrow" defaultValue={content.offersIntro.eyebrow} required className={inputClass} /></div>
            <div><label className={labelClass}>Titre</label><input name="title" defaultValue={content.offersIntro.title} required className={inputClass} /></div>
            <div><label className={labelClass}>Texte du lien</label><input name="linkLabel" defaultValue={content.offersIntro.linkLabel} required className={inputClass} /></div>
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Introduction du blog</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="blog_intro" {...sectionMeta('blog_intro', 60)} />
            <div><label className={labelClass}>Petit titre</label><input name="eyebrow" defaultValue={content.blogIntro.eyebrow} required className={inputClass} /></div>
            <div><label className={labelClass}>Titre</label><input name="title" defaultValue={content.blogIntro.title} required className={inputClass} /></div>
            <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={content.blogIntro.description} required rows={4} className={inputClass} /></div>
            <SubmitButton />
          </form>
        </details>

        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer list-none text-xl font-black text-ink marker:content-none">Appel à l’action final</summary>
          <form action={saveHomepageSectionAction} className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <SectionMeta sectionKey="final_cta" {...sectionMeta('final_cta', 70)} />
            <div><label className={labelClass}>Titre</label><input name="title" defaultValue={content.finalCta.title} required className={inputClass} /></div>
            <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={content.finalCta.description} required rows={4} className={inputClass} /></div>
            <div><label className={labelClass}>Texte du bouton</label><input name="buttonLabel" defaultValue={content.finalCta.buttonLabel} required className={inputClass} /></div>
            <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsappMessage" defaultValue={content.finalCta.whatsappMessage} required rows={3} className={inputClass} /></div>
            <SubmitButton />
          </form>
        </details>
      </div>
    </div>
  );
}
