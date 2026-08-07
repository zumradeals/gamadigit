import { Save } from 'lucide-react';
import { saveSettingsAction } from '@/app/admin/(protected)/actions';
import { MediaUploader } from '@/components/admin/media-uploader';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: settings }, { data: media }] = supabase
    ? await Promise.all([
        supabase.from('site_settings').select('payload, updated_at').eq('id', 'main').maybeSingle(),
        supabase.from('media_assets').select('id, public_url, alt_text, mime_type, storage_path').order('created_at', { ascending: false }),
      ])
    : [{ data: null }, { data: [] }];

  const payload = (settings?.payload || {}) as Record<string, string>;
  const images = (media || []).filter((asset) => String(asset.mime_type || '').startsWith('image/') && asset.public_url);
  const logoUrl = payload.logoUrl || '';
  const faviconUrl = payload.faviconUrl || '';
  const socialImageUrl = payload.socialImageUrl || '';

  const AssetSelect = ({ name, label, value, hint }: { name: string; label: string; value: string; hint: string }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select name={name} defaultValue={value} className={inputClass}>
        <option value="">Utiliser l’image intégrée par défaut</option>
        {images.map((asset) => <option key={asset.id} value={asset.public_url}>{asset.alt_text || asset.storage_path}</option>)}
      </select>
      <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Configuration</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Paramètres du site</h1>
      <p className="mt-3 text-slate-600">Gérez l’identité publique, les médias de marque, les coordonnées et le canal WhatsApp principal.</p>

      <div className="mt-8 max-w-5xl">
        <MediaUploader />
        <p className="mt-3 text-sm text-slate-500">Téléversez d’abord votre logo, favicon ou image de partage ici. Ils apparaîtront ensuite dans les listes ci-dessous.</p>
      </div>

      <form action={saveSettingsAction} className="mt-8 max-w-5xl space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <section>
          <h2 className="text-xl font-black text-ink">Identité</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><label className={labelClass}>Nom</label><input name="name" defaultValue={payload.name || 'DG AFRIQUE'} required className={inputClass} /></div>
            <div><label className={labelClass}>Signature</label><input name="tagline" defaultValue={payload.tagline || 'Des solutions pour faire avancer l’Afrique.'} required className={inputClass} /></div>
          </div>
          <div className="mt-5"><label className={labelClass}>Mention institutionnelle</label><input name="ecosystemLabel" defaultValue={payload.ecosystemLabel || 'Développement Global Afrique'} className={inputClass} /></div>
        </section>

        <section className="border-t border-slate-100 pt-7">
          <h2 className="text-xl font-black text-ink">Identité visuelle</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Le site respecte automatiquement les proportions originales du logo : aucune largeur forcée, aucune déformation.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <AssetSelect name="logoUrl" label="Logo principal" value={logoUrl} hint="PNG, WebP ou SVG horizontal recommandé. Utilisé dans l’en-tête et le pied de page." />
            <AssetSelect name="faviconUrl" label="Favicon" value={faviconUrl} hint="Image carrée recommandée, idéalement SVG ou PNG 512×512." />
            <AssetSelect name="socialImageUrl" label="Image de partage social" value={socialImageUrl} hint="Pour Facebook, WhatsApp, LinkedIn et autres aperçus. Format paysage recommandé." />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-cloud p-4">
              <p className="text-xs font-black uppercase tracking-[0.11em] text-slate-500">Aperçu logo</p>
              <div className="mt-3 flex h-28 items-center justify-center rounded-xl bg-white p-3"><img src={logoUrl || '/brand/dg-afrique.svg'} alt="Aperçu logo" className="max-h-full max-w-full object-contain" /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-cloud p-4">
              <p className="text-xs font-black uppercase tracking-[0.11em] text-slate-500">Aperçu favicon</p>
              <div className="mt-3 flex h-28 items-center justify-center rounded-xl bg-white p-4"><img src={faviconUrl || '/favicon.svg'} alt="Aperçu favicon" className="h-16 w-16 object-contain" /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-cloud p-4">
              <p className="text-xs font-black uppercase tracking-[0.11em] text-slate-500">Aperçu partage</p>
              <div className="mt-3 flex h-28 items-center justify-center rounded-xl bg-white p-3">{socialImageUrl ? <img src={socialImageUrl} alt="Aperçu partage" className="max-h-full max-w-full object-contain" /> : <span className="text-center text-xs text-slate-400">Aucune image personnalisée</span>}</div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-7">
          <h2 className="text-xl font-black text-ink">Coordonnées</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><label className={labelClass}>Numéro WhatsApp sans +</label><input name="whatsappNumber" defaultValue={payload.whatsappNumber || '2250718713781'} required className={inputClass} /></div>
            <div><label className={labelClass}>Téléphone affiché</label><input name="phone" defaultValue={payload.phone || '+225 07 18 71 37 81'} required className={inputClass} /></div>
            <div><label className={labelClass}>E-mail</label><input name="email" type="email" defaultValue={payload.email || 'contact@dgafrique.com'} required className={inputClass} /></div>
            <div><label className={labelClass}>Localisation</label><input name="location" defaultValue={payload.location || 'Abidjan, Côte d’Ivoire'} required className={inputClass} /></div>
          </div>
        </section>

        <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer les paramètres</button>
      </form>
    </div>
  );
}
