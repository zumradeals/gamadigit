import { FileText, Save, Trash2 } from 'lucide-react';
import { deleteMediaAction, updateMediaAction } from '@/app/admin/(protected)/content-actions';
import { MediaUploader } from '@/components/admin/media-uploader';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';

function readableSize(value: number | null) {
  if (!value) return 'Taille inconnue';
  if (value < 1024) return `${value} o`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} Ko`;
  return `${(value / (1024 * 1024)).toFixed(1)} Mo`;
}

export default async function AdminMediaPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from('media_assets').select('*').order('created_at', { ascending: false })
    : { data: [] };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Bibliothèque</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Médias et documents</h1>
      <p className="mt-3 text-slate-600">Centralisez les images et documents utilisés dans les services, articles et pages.</p>

      <div className="mt-8"><MediaUploader /></div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {data?.length ? data.map((asset) => {
          const isImage = String(asset.mime_type || '').startsWith('image/');
          return (
            <article key={asset.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-52 items-center justify-center bg-cloud">
                {isImage && asset.public_url ? (
                  <img src={asset.public_url} alt={asset.alt_text || ''} className="h-full w-full object-contain p-3" />
                ) : (
                  <FileText className="h-16 w-16 text-ocean" />
                )}
              </div>
              <div className="p-5">
                <p className="truncate text-xs font-bold text-slate-400" title={asset.storage_path}>{asset.storage_path}</p>
                <p className="mt-2 text-sm font-bold text-ink">{asset.mime_type || 'Fichier'} · {readableSize(asset.size_bytes)}</p>
                {asset.public_url && <a href={asset.public_url} target="_blank" rel="noreferrer" className="mt-3 block truncate text-sm font-bold text-ocean">Ouvrir le fichier</a>}

                <form action={updateMediaAction} className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  <input type="hidden" name="id" value={asset.id} />
                  <label className="block text-xs font-black uppercase tracking-[0.11em] text-slate-500">Texte alternatif</label>
                  <input name="alt_text" defaultValue={asset.alt_text || ''} className={inputClass} />
                  <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-4 py-2.5 text-sm font-black text-white"><Save className="h-4 w-4" />Enregistrer</button>
                </form>

                <form action={deleteMediaAction} className="mt-3">
                  <input type="hidden" name="id" value={asset.id} />
                  <input type="hidden" name="storage_path" value={asset.storage_path} />
                  <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-black text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />Supprimer</button>
                </form>
              </div>
            </article>
          );
        }) : <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Aucun média enregistré.</div>}
      </div>
    </div>
  );
}
