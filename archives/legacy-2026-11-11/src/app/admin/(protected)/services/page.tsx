import { Plus, Save } from 'lucide-react';
import { saveFamilyAction, saveServiceAction } from '@/app/admin/(protected)/actions';
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

export default async function AdminServicesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: families } = supabase
    ? await supabase.from('service_families').select('*').order('sort_order')
    : { data: [] };
  const { data: services } = supabase
    ? await supabase.from('services').select('*').order('sort_order')
    : { data: [] };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Catalogue</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Familles et services</h1>
      <p className="mt-3 text-slate-600">Créez et modifiez les offres qui seront ensuite affichées sur le site public.</p>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none">
              <Plus className="h-5 w-5 text-ocean" /> Nouvelle famille
            </summary>
            <form action={saveFamilyAction} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Nom</label><input name="name" required className={inputClass} /></div>
                <div><label className={labelClass}>Nom court</label><input name="short_name" required className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Slug</label><input name="slug" placeholder="créé automatiquement si vide" className={inputClass} /></div>
              <div><label className={labelClass}>Accroche</label><input name="eyebrow" className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea name="description" required rows={4} className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className={labelClass}>Icône</label><select name="icon" className={inputClass}><option value="code">Code</option><option value="palette">Palette</option><option value="cloud">Cloud</option><option value="package">Logiciel</option><option value="graduation">Formation</option><option value="building">Entreprise</option></select></div>
                <div><label className={labelClass}>Couleur</label><input name="accent" type="color" defaultValue="#0877C9" className={`${inputClass} h-12`} /></div>
                <div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue="0" className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Statut</label><StatusSelect /></div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer la famille</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {families?.map((family) => (
              <details key={family.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none">
                  <div><p className="font-black text-ink">{family.name}</p><p className="mt-1 text-xs text-slate-400">/{family.slug}</p></div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{family.status}</span>
                </summary>
                <form action={saveFamilyAction} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                  <input type="hidden" name="id" value={family.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={labelClass}>Nom</label><input name="name" defaultValue={family.name} required className={inputClass} /></div>
                    <div><label className={labelClass}>Nom court</label><input name="short_name" defaultValue={family.short_name} required className={inputClass} /></div>
                  </div>
                  <div><label className={labelClass}>Slug</label><input name="slug" defaultValue={family.slug} required className={inputClass} /></div>
                  <div><label className={labelClass}>Accroche</label><input name="eyebrow" defaultValue={family.eyebrow || ''} className={inputClass} /></div>
                  <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={family.description} required rows={4} className={inputClass} /></div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><label className={labelClass}>Icône</label><select name="icon" defaultValue={family.icon || 'code'} className={inputClass}><option value="code">Code</option><option value="palette">Palette</option><option value="cloud">Cloud</option><option value="package">Logiciel</option><option value="graduation">Formation</option><option value="building">Entreprise</option></select></div>
                    <div><label className={labelClass}>Couleur</label><input name="accent" type="color" defaultValue={family.accent || '#0877C9'} className={`${inputClass} h-12`} /></div>
                    <div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={family.sort_order || 0} className={inputClass} /></div>
                  </div>
                  <div><label className={labelClass}>Statut</label><StatusSelect value={family.status} /></div>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
                </form>
              </details>
            ))}
          </div>
        </section>

        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none">
              <Plus className="h-5 w-5 text-ocean" /> Nouveau service
            </summary>
            <form action={saveServiceAction} className="mt-6 space-y-4">
              <div><label className={labelClass}>Famille</label><select name="family_id" required className={inputClass}><option value="">Choisir</option>{families?.map((family) => <option key={family.id} value={family.id}>{family.name}</option>)}</select></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Nom</label><input name="name" required className={inputClass} /></div><div><label className={labelClass}>Slug</label><input name="slug" className={inputClass} /></div></div>
              <div><label className={labelClass}>Résumé</label><textarea name="excerpt" required rows={3} className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea name="description" required rows={5} className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Prix affiché</label><input name="price_label" placeholder="Sur devis" className={inputClass} /></div><div><label className={labelClass}>Délai</label><input name="delivery_label" className={inputClass} /></div></div>
              <div><label className={labelClass}>Éléments inclus — un par ligne</label><textarea name="features" rows={4} className={inputClass} /></div>
              <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsapp_message" rows={3} className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue="0" className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect /></div></div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="is_featured" /> Mettre en avant sur l’accueil</label>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer le service</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {services?.map((service) => (
              <details key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none"><div><p className="font-black text-ink">{service.name}</p><p className="mt-1 text-xs text-slate-400">{service.price_label || 'Sur devis'} · /{service.slug}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{service.status}</span></summary>
                <form action={saveServiceAction} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                  <input type="hidden" name="id" value={service.id} />
                  <div><label className={labelClass}>Famille</label><select name="family_id" defaultValue={service.family_id} required className={inputClass}>{families?.map((family) => <option key={family.id} value={family.id}>{family.name}</option>)}</select></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Nom</label><input name="name" defaultValue={service.name} required className={inputClass} /></div><div><label className={labelClass}>Slug</label><input name="slug" defaultValue={service.slug} required className={inputClass} /></div></div>
                  <div><label className={labelClass}>Résumé</label><textarea name="excerpt" defaultValue={service.excerpt} required rows={3} className={inputClass} /></div>
                  <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={service.description} required rows={5} className={inputClass} /></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Prix affiché</label><input name="price_label" defaultValue={service.price_label || ''} className={inputClass} /></div><div><label className={labelClass}>Délai</label><input name="delivery_label" defaultValue={service.delivery_label || ''} className={inputClass} /></div></div>
                  <div><label className={labelClass}>Éléments inclus</label><textarea name="features" defaultValue={Array.isArray(service.features) ? service.features.join('\n') : ''} rows={4} className={inputClass} /></div>
                  <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsapp_message" defaultValue={service.whatsapp_message || ''} rows={3} className={inputClass} /></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={service.sort_order || 0} className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect value={service.status} /></div></div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="is_featured" defaultChecked={service.is_featured} /> Mettre en avant sur l’accueil</label>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
                </form>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
