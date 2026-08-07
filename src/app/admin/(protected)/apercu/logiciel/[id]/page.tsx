import { ArrowLeft, Check, MessageCircle, PackageCheck, Pencil, ShieldCheck, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function firstImage(value: unknown) {
  if (!Array.isArray(value) || !value[0] || typeof value[0] !== 'object') return null;
  const item = value[0] as Record<string, unknown>;
  return typeof item.url === 'string' ? item.url : typeof item.public_url === 'string' ? item.public_url : null;
}

export default async function AdminSoftwarePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: product } = supabase
    ? await supabase.from('services').select('*, software_categories(name)').eq('id', id).maybeSingle()
    : { data: null };
  if (!product) notFound();

  const image = firstImage(product.media);
  const features = stringArray(product.features);
  const targetAudience = stringArray(product.target_audience);
  const keyPoints = stringArray(product.key_points);
  const category = Array.isArray(product.software_categories) ? product.software_categories[0] : product.software_categories;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="/admin/logiciels" className="inline-flex items-center gap-2 text-sm font-black text-ocean"><ArrowLeft className="h-4 w-4" />Retour aux logiciels</a>
        <a href={`/admin/logiciels#produit-${product.id}`} className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white"><Pencil className="h-4 w-4" />Modifier la fiche</a>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Prévisualisation privée — statut actuel : <strong>{product.status}</strong>. Cette page n’est pas visible par le public.</div>

      <section className="overflow-hidden rounded-[2rem] bg-ink text-white shadow-xl">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-black uppercase tracking-[0.15em] text-cyan">{category?.name || 'Logiciel professionnel'}</p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{product.excerpt}</p>
            <div className="mt-8 flex flex-wrap gap-4"><div className="rounded-2xl bg-white/10 px-5 py-4"><p className="text-xs font-black uppercase text-slate-400">Tarif</p><p className="mt-1 text-2xl font-black">{product.price_label || 'À définir'}</p></div><div className="rounded-2xl bg-white/10 px-5 py-4"><p className="text-xs font-black uppercase text-slate-400">Formule</p><p className="mt-1 font-black">{product.delivery_label || 'À définir'}</p></div></div>
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3 font-black"><MessageCircle className="h-5 w-5" />Bouton WhatsApp public</div>
          </div>
          <div className="flex min-h-80 items-center justify-center bg-white/5">{image ? <img src={image} alt={product.name} className="h-full w-full object-cover" /> : <PackageCheck className="h-24 w-24 text-cyan" />}</div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-[2rem] bg-white p-8 shadow-sm"><h2 className="text-3xl font-black text-ink">Description complète</h2><p className="mt-6 whitespace-pre-line text-lg leading-9 text-slate-700">{product.description}</p>{features.length ? <div className="mt-9"><h3 className="text-2xl font-black text-ink">Avantages</h3><ul className="mt-5 grid gap-4 sm:grid-cols-2">{features.map((item) => <li key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" /><span className="leading-7 text-slate-700">{item}</span></li>)}</ul></div> : null}{keyPoints.length ? <div className="mt-9"><h3 className="text-2xl font-black text-ink">Points essentiels</h3><ul className="mt-5 space-y-3">{keyPoints.map((item) => <li key={item} className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ocean" /><span className="leading-7 text-slate-700">{item}</span></li>)}</ul></div> : null}</article>
        <aside className="space-y-6">{targetAudience.length ? <div className="rounded-[2rem] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><Users className="h-6 w-6 text-ocean" /><h2 className="text-2xl font-black text-ink">Public concerné</h2></div><ul className="mt-5 space-y-3">{targetAudience.map((item) => <li key={item} className="leading-7 text-slate-700">• {item}</li>)}</ul></div> : null}<div className="rounded-[2rem] bg-white p-7 shadow-sm"><h2 className="text-xl font-black text-ink">SEO</h2><p className="mt-4 text-sm font-bold text-slate-700">{product.seo_title || 'Titre SEO non défini'}</p><p className="mt-2 text-sm leading-6 text-slate-500">{product.seo_description || 'Description SEO non définie'}</p></div></aside>
      </div>
    </div>
  );
}
