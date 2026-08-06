import { PackagePlus, Save } from 'lucide-react';
import {
  saveSoftwareCategoryAction,
  saveSoftwareProductAction,
} from '@/app/admin/(protected)/logiciels/actions';
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

function firstImage(media: unknown) {
  if (!Array.isArray(media) || !media.length || !media[0] || typeof media[0] !== 'object') return { url: '', alt: '' };
  const item = media[0] as Record<string, unknown>;
  return {
    url: typeof item.url === 'string' ? item.url : typeof item.public_url === 'string' ? item.public_url : '',
    alt: typeof item.alt === 'string' ? item.alt : typeof item.alt_text === 'string' ? item.alt_text : '',
  };
}

export default async function AdminSoftwarePage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = supabase
    ? await supabase.from('software_categories').select('*').order('sort_order')
    : { data: [] };
  const { data: family } = supabase
    ? await supabase.from('service_families').select('id').eq('slug', 'logiciels-abonnements').maybeSingle()
    : { data: null };
  const { data: products } = supabase && family
    ? await supabase.from('services').select('*').eq('family_id', family.id).order('sort_order')
    : { data: [] };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Catalogue commercial</p>
      <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-black text-ink">Logiciels et abonnements</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Organisez les produits par univers. Une image est facultative : les cartes restent propres avec un visuel générique tant qu’aucune image n’est renseignée.
          </p>
        </div>
        <a href="/logiciels" target="_blank" rel="noreferrer" className="rounded-xl bg-ink px-5 py-3 text-center text-sm font-black text-white">
          Voir le catalogue public
        </a>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.75fr_1.25fr]">
        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none">
              <PackagePlus className="h-5 w-5 text-ocean" /> Nouvelle catégorie
            </summary>
            <form action={saveSoftwareCategoryAction} className="mt-6 space-y-4">
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
                <form action={saveSoftwareCategoryAction} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
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
              <PackagePlus className="h-5 w-5 text-ocean" /> Nouveau logiciel ou abonnement
            </summary>
            <form action={saveSoftwareProductAction} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Catégorie</label><select name="software_category_id" required className={inputClass}><option value="">Choisir</option>{categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                <div><label className={labelClass}>Référence</label><input name="product_code" placeholder="Ex. M001" className={inputClass} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Nom</label><input name="name" required className={inputClass} /></div><div><label className={labelClass}>Slug</label><input name="slug" className={inputClass} /></div></div>
              <div><label className={labelClass}>Résumé</label><textarea name="excerpt" required rows={3} className={inputClass} /></div>
              <div><label className={labelClass}>Description</label><textarea name="description" required rows={4} className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Prix affiché</label><input name="price_label" placeholder="Sur devis" className={inputClass} /></div><div><label className={labelClass}>Durée / compatibilité</label><input name="delivery_label" className={inputClass} /></div></div>
              <div><label className={labelClass}>Avantages — un par ligne</label><textarea name="features" rows={4} className={inputClass} /></div>
              <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsapp_message" rows={3} className={inputClass} /></div>
              <div className="rounded-xl bg-cloud p-4">
                <p className="text-sm font-black text-ink">Image facultative</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Laissez vide pour utiliser le visuel générique. Vous pourrez ajouter l’URL d’une image après son téléversement dans Médias.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>URL de l’image</label><input name="image_url" type="url" className={inputClass} /></div><div><label className={labelClass}>Texte alternatif</label><input name="image_alt" className={inputClass} /></div></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue="0" className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect /></div></div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="is_featured" /> Afficher parmi les six logiciels de l’accueil</label>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer le produit</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {products?.map((product) => {
              const image = firstImage(product.media);
              return (
                <details key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-ocean">{product.product_code || 'Produit'}</p>
                      <p className="mt-1 font-black text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{product.price_label || 'Sur devis'} · /{product.slug}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{product.status}</span>
                  </summary>
                  <form action={saveSoftwareProductAction} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                    <input type="hidden" name="id" value={product.id} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className={labelClass}>Catégorie</label><select name="software_category_id" defaultValue={product.software_category_id || ''} required className={inputClass}>{categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                      <div><label className={labelClass}>Référence</label><input name="product_code" defaultValue={product.product_code || ''} className={inputClass} /></div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Nom</label><input name="name" defaultValue={product.name} required className={inputClass} /></div><div><label className={labelClass}>Slug</label><input name="slug" defaultValue={product.slug} required className={inputClass} /></div></div>
                    <div><label className={labelClass}>Résumé</label><textarea name="excerpt" defaultValue={product.excerpt} required rows={3} className={inputClass} /></div>
                    <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={product.description} required rows={4} className={inputClass} /></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Prix affiché</label><input name="price_label" defaultValue={product.price_label || ''} className={inputClass} /></div><div><label className={labelClass}>Durée / compatibilité</label><input name="delivery_label" defaultValue={product.delivery_label || ''} className={inputClass} /></div></div>
                    <div><label className={labelClass}>Avantages</label><textarea name="features" defaultValue={Array.isArray(product.features) ? product.features.join('\n') : ''} rows={4} className={inputClass} /></div>
                    <div><label className={labelClass}>Message WhatsApp</label><textarea name="whatsapp_message" defaultValue={product.whatsapp_message || ''} rows={3} className={inputClass} /></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>URL de l’image</label><input name="image_url" type="url" defaultValue={image.url} className={inputClass} /></div><div><label className={labelClass}>Texte alternatif</label><input name="image_alt" defaultValue={image.alt || product.name} className={inputClass} /></div></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={product.sort_order || 0} className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect value={product.status} /></div></div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" name="is_featured" defaultChecked={product.is_featured} /> Afficher parmi les six logiciels de l’accueil</label>
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
