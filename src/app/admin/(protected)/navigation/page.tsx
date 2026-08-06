import { Plus, Save } from 'lucide-react';
import { saveMenuAction, saveMenuItemAction } from '@/app/admin/(protected)/content-actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

function StatusSelect({ value = 'draft' }: { value?: string }) {
  return <select name="status" defaultValue={value} className={inputClass}><option value="draft">Brouillon</option><option value="published">Publié</option><option value="archived">Archivé</option></select>;
}

export default async function AdminNavigationPage() {
  const supabase = await createSupabaseServerClient();
  const { data: menus } = supabase ? await supabase.from('menus').select('*').order('created_at') : { data: [] };
  const { data: items } = supabase ? await supabase.from('menu_items').select('*').order('sort_order') : { data: [] };
  const safeMenus = menus || [];
  const safeItems = items || [];

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Navigation</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Menus et liens</h1>
      <p className="mt-3 text-slate-600">Contrôlez les liens du menu principal et du pied de page, ainsi que leurs sous-menus.</p>

      <div className="mt-8 grid gap-8 xl:grid-cols-[.75fr_1.25fr]">
        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none"><Plus className="h-5 w-5 text-ocean" />Nouveau menu</summary>
            <form action={saveMenuAction} className="mt-6 space-y-4">
              <div><label className={labelClass}>Nom</label><input name="name" required className={inputClass} /></div>
              <div><label className={labelClass}>Emplacement</label><input name="location" placeholder="header ou footer" required className={inputClass} /></div>
              <div><label className={labelClass}>Statut</label><StatusSelect /></div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Créer le menu</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {safeMenus.map((menu) => (
              <details key={menu.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none"><div><p className="font-black text-ink">{menu.name}</p><p className="mt-1 text-xs text-slate-400">{menu.location}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{menu.status}</span></summary>
                <form action={saveMenuAction} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                  <input type="hidden" name="id" value={menu.id} />
                  <div><label className={labelClass}>Nom</label><input name="name" defaultValue={menu.name} required className={inputClass} /></div>
                  <div><label className={labelClass}>Emplacement</label><input name="location" defaultValue={menu.location} required className={inputClass} /></div>
                  <div><label className={labelClass}>Statut</label><StatusSelect value={menu.status} /></div>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-4 py-3 text-sm font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
                </form>
              </details>
            ))}
          </div>
        </section>

        <section>
          <details open className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none"><Plus className="h-5 w-5 text-ocean" />Nouveau lien</summary>
            <form action={saveMenuItemAction} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Menu</label><select name="menu_id" required className={inputClass}><option value="">Choisir</option>{safeMenus.map((menu) => <option key={menu.id} value={menu.id}>{menu.name}</option>)}</select></div>
                <div><label className={labelClass}>Parent facultatif</label><select name="parent_id" className={inputClass}><option value="">Aucun</option>{safeItems.filter((item) => !item.parent_id).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Libellé</label><input name="label" required className={inputClass} /></div><div><label className={labelClass}>URL</label><input name="url" placeholder="/blog ou https://…" required className={inputClass} /></div></div>
              <div className="grid gap-4 sm:grid-cols-3"><div><label className={labelClass}>Ouverture</label><select name="target" className={inputClass}><option value="_self">Même fenêtre</option><option value="_blank">Nouvelle fenêtre</option></select></div><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue="0" className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect /></div></div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Créer le lien</button>
            </form>
          </details>

          <div className="mt-5 space-y-4">
            {safeItems.map((item) => {
              const menu = safeMenus.find((entry) => entry.id === item.menu_id);
              const possibleParents = safeItems.filter((entry) => entry.menu_id === item.menu_id && entry.id !== item.id && !entry.parent_id);
              return (
                <details key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none"><div><p className="font-black text-ink">{item.parent_id ? '↳ ' : ''}{item.label}</p><p className="mt-1 text-xs text-slate-400">{menu?.name || 'Menu'} · {item.url}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.status}</span></summary>
                  <form action={saveMenuItemAction} className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Menu</label><select name="menu_id" defaultValue={item.menu_id} required className={inputClass}>{safeMenus.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></div><div><label className={labelClass}>Parent</label><select name="parent_id" defaultValue={item.parent_id || ''} className={inputClass}><option value="">Aucun</option>{possibleParents.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></div></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass}>Libellé</label><input name="label" defaultValue={item.label} required className={inputClass} /></div><div><label className={labelClass}>URL</label><input name="url" defaultValue={item.url} required className={inputClass} /></div></div>
                    <div className="grid gap-4 sm:grid-cols-3"><div><label className={labelClass}>Ouverture</label><select name="target" defaultValue={item.target} className={inputClass}><option value="_self">Même fenêtre</option><option value="_blank">Nouvelle fenêtre</option></select></div><div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={item.sort_order} className={inputClass} /></div><div><label className={labelClass}>Statut</label><StatusSelect value={item.status} /></div></div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-4 py-3 text-sm font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
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
