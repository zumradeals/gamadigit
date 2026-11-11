import { GraduationCap, Save } from 'lucide-react';
import {
  saveTrainingCategoryAction,
  saveTrainingProgramAction,
} from '@/app/admin/(protected)/formations/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

function StatusSelect({ value = 'draft' }: { value?: string }) {
  return (
    <select name="status" defaultValue={value} className={inputClass}>
      <option value="draft">Brouillon</option>
      <option value="published">Publié</option>
      <option value="archived">Archivé</option>
    </select>
  );
}

function KindSelect({ value = 'software' }: { value?: string }) {
  return (
    <select name="kind" defaultValue={value} className={inputClass}>
      <option value="software">Formation logiciel</option>
      <option value="career_pack">Pack métier premium</option>
    </select>
  );
}

function firstImage(media: unknown) {
  if (!Array.isArray(media) || !media.length || !media[0] || typeof media[0] !== 'object') return { url: '', alt: '' };
  const item = media[0] as Record<string, unknown>;
  return {
    url: typeof item.url === 'string' ? item.url : typeof item.public_url === 'string' ? item.public_url : '',
    alt: typeof item.alt === 'string' ? item.alt : typeof item.alt_text === 'string' ? item.alt_text : '',
  };
}

export default async function AdminTrainingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = supabase
    ? await supabase.from('training_categories').select('*').order('sort_order')
    : { data: [] };
  const { data: programs } = supabase
    ? await supabase.from('training_programs').select('*').order('sort_order')
    : { data: [] };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Pôle formation</p>
      <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-black text-ink">Formations professionnelles</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Gérez librement les programmes, les prix et leur visibilité. Un prix peut être enregistré sans être affiché, ou laissé vide jusqu’à la finalisation de l’accord avec le partenaire.
          </p>
        </div>
        <a href="/formations" target="_blank" rel="noreferrer" className="rounded-xl bg-ink px-5 py-3 text-center text-sm font-black text-white">
          Voir la page publique
        </a>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan/20 bg-blue-50 p-5 text-sm leading-6 text-slate-700">
        <strong className="text-ink">Conseil commercial :</strong> laissez « Afficher le prix » désactivé tant que la commission ou la majoration n’est pas définie. Le visiteur verra alors « Tarif sur WhatsApp ».
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none">
              <GraduationCap className="h-5 w-5 text-ocean" /> Nouvelle catégorie
            </summary>
            <form action={saveTrainingCategoryAction} className="mt-6 space-y-4">
              <div><label className={labelClass}>Nom</label><input name="name" required className={inputClass} /></div>
              <div><label className={labelClass}>Slug</label><input name="slug" placeholder="créé automatiquement si vide" className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea name="description" rows={3} className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className={labelClass}>Couleur</label><input name="accent" type="color" defaultValue="#0877C9" className={`${inputClass} h-12`} /></div>
                <div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue="0" className={inputClass} /></div>
                <div><label className={labelClass}>Statut</label><StatusSelect /></div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {categories?.map((category) => (
              <details key={category.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: category.accent || '#0877C9' }} />
                    <div><p className="font-black text-ink">{category.name}</p><p className="mt-1 text-xs text-slate-400">/{category.slug}</p></div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{category.status}</span>
                </summary>
                <form action={saveTrainingCategoryAction} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                  <input type="hidden" name="id" value={category.id} />
                  <div><label className={labelClass}>Nom</label><input name="name" defaultValue={category.name} required className={inputClass} /></div>
                  <div><label className={labelClass}>Slug</label><input name="slug" defaultValue={category.slug} required className={inputClass} /></div>
                  <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={category.description || ''} rows={3} className={inputClass} /></div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><label className={labelClass}>Couleur</label><input name="accent" type="color" defaultValue={category.accent || '#0877C9'} className={`${inputClass} h-12`} /></div>
                    <div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={category.sort_order || 0} className={inputClass} /></div>
                    <div><label className={labelClass}>Statut</label><StatusSelect value={category.status} /></div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
                </form>
              </details>
            ))}
          </div>
        </section>

        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none">
              <GraduationCap className="h-5 w-5 text-ocean" /> Nouvelle formation
            </summary>
            <form action={saveTrainingProgramAction} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Catégorie</label><select name="category_id" required className={inputClass}><option value="">Choisir</option>{categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                <div><label className={labelClass}>Type</label><KindSelect /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Nom</label><input name="name" required className={inputClass} /></div><div><label className={labelClass}>Slug</label><input name="slug" className={inputClass} /></div></div>
              <div><label className={labelClass}>Résumé</label><textarea name="excerpt" required rows={3} className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea name="description" required rows={4} className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className={labelClass}>Prix</label><input name="price_label" placeholder="Ex. 100 000 FCFA" className={inputClass} /></div>
                <div><label className={labelClass}>Durée</label><input name="duration_label" placeholder="Ex. 6 semaines" className={inputClass} /></div>
                <div><label className={labelClass}>Format</label><input name="format_label" placeholder="En ligne / présentiel" className={inputClass} /></div>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700"><input type="checkbox" name="show_price" className="mt-1" /><span><strong className="block text-ink">Afficher le prix au public</strong>Sinon la carte indique « Tarif sur WhatsApp ».</span></label>
              <div><label className={labelClass}>Points forts — un par ligne</label><textarea name="highlights" rows={4} defaultValue={'Information claire avant inscription\nÉchange direct sur WhatsApp\nModalités confirmées avec le conseiller'} className={inputClass} /></div>
              <div><label className={labelClass}>Mention du partenaire</label><input name="partner_label" defaultValue="Programme proposé par GamaDigit avec notre partenaire formateur spécialisé." className={inputClass} /></div>
              <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsapp_message" rows={3} className={inputClass} /></div>
              <div className="rounded-xl bg-cloud p-4">
                <p className="text-sm font-black text-ink">Image facultative</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">La page fonctionne sans image. Vous pourrez ajouter une URL depuis la bibliothèque Médias plus tard.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>URL de l’image</label><input name="image_url" type="url" className={inputClass} /></div><div><label className={labelClass}>Texte alternatif</label><input name="image_alt" className={inputClass} /></div></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue="0" className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect /></div></div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="is_featured" /> Afficher parmi les formations mises en avant</label>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer la formation</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {programs?.map((program) => {
              const image = firstImage(program.media);
              return (
                <details key={program.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-ocean">{program.kind === 'career_pack' ? 'Pack métier' : 'Formation logiciel'}</p>
                      <p className="mt-1 font-black text-ink">{program.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{program.show_price && program.price_label ? program.price_label : 'Tarif masqué'} · /{program.slug}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{program.status}</span>
                  </summary>
                  <form action={saveTrainingProgramAction} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                    <input type="hidden" name="id" value={program.id} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className={labelClass}>Catégorie</label><select name="category_id" defaultValue={program.category_id} required className={inputClass}>{categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                      <div><label className={labelClass}>Type</label><KindSelect value={program.kind} /></div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Nom</label><input name="name" defaultValue={program.name} required className={inputClass} /></div><div><label className={labelClass}>Slug</label><input name="slug" defaultValue={program.slug} required className={inputClass} /></div></div>
                    <div><label className={labelClass}>Résumé</label><textarea name="excerpt" defaultValue={program.excerpt} required rows={3} className={inputClass} /></div>
                    <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={program.description} required rows={4} className={inputClass} /></div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div><label className={labelClass}>Prix</label><input name="price_label" defaultValue={program.price_label || ''} className={inputClass} /></div>
                      <div><label className={labelClass}>Durée</label><input name="duration_label" defaultValue={program.duration_label || ''} className={inputClass} /></div>
                      <div><label className={labelClass}>Format</label><input name="format_label" defaultValue={program.format_label || ''} className={inputClass} /></div>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="show_price" defaultChecked={program.show_price} /> Afficher le prix au public</label>
                    <div><label className={labelClass}>Points forts</label><textarea name="highlights" defaultValue={Array.isArray(program.highlights) ? program.highlights.join('\n') : ''} rows={4} className={inputClass} /></div>
                    <div><label className={labelClass}>Mention du partenaire</label><input name="partner_label" defaultValue={program.partner_label || ''} className={inputClass} /></div>
                    <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsapp_message" defaultValue={program.whatsapp_message || ''} rows={3} className={inputClass} /></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>URL de l’image</label><input name="image_url" type="url" defaultValue={image.url} className={inputClass} /></div><div><label className={labelClass}>Texte alternatif</label><input name="image_alt" defaultValue={image.alt || program.name} className={inputClass} /></div></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={program.sort_order || 0} className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect value={program.status} /></div></div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="is_featured" defaultChecked={program.is_featured} /> Mettre en avant</label>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
                  </form>
                </details>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
