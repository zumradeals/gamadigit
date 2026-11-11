import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Boxes,
  GraduationCap,
  Images,
  Package,
} from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const modules = [
  { href: '/admin/logiciels', label: 'Logiciels', text: 'Catalogue, catégories, prix, disponibilité et fiches produits.', icon: Package },
  { href: '/admin/formations', label: 'Formations', text: 'Programmes, packs, tarifs, modalités et contenus de formation.', icon: GraduationCap },
  { href: '/admin/services', label: 'Services numériques', text: 'Web, applications, infrastructure et prestations numériques.', icon: Boxes },
  { href: '/admin/articles', label: 'Articles', text: 'Conseils, actualités et contenus pour attirer et informer les visiteurs.', icon: BookOpen },
  { href: '/admin/medias', label: 'Médias', text: 'Images, illustrations et documents utilisés par le pôle.', icon: Images },
  { href: '/admin/copilote', label: 'Copilote', text: 'Assistance éditoriale pour préparer les contenus commerciaux.', icon: Bot },
];

export default async function AdminDigitalPolePage() {
  const supabase = await createSupabaseServerClient();

  const [servicesResult, trainingResult, postsResult] = supabase
    ? await Promise.all([
        supabase.from('services').select('id, service_families!inner(slug)', { count: 'exact' }),
        supabase.from('training_programs').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      ])
    : [{ data: [], count: 0 }, { count: 0 }, { count: 0 }];

  const allServices = servicesResult.data || [];
  const softwareCount = allServices.filter((row) => {
    const family = Array.isArray(row.service_families) ? row.service_families[0] : row.service_families;
    return family?.slug === 'logiciels-abonnements';
  }).length;
  const digitalServiceCount = allServices.filter((row) => {
    const family = Array.isArray(row.service_families) ? row.service_families[0] : row.service_families;
    return family?.slug && !['logiciels-abonnements', 'formation-accompagnement'].includes(family.slug);
  }).length;

  const stats = [
    { label: 'Logiciels', value: softwareCount },
    { label: 'Formations', value: trainingResult.count || 0 },
    { label: 'Services numériques', value: digitalServiceCount },
    { label: 'Articles', value: postsResult.count || 0 },
  ];

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">DG AFRIQUE</p>
      <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-black text-ink">Pôle numérique</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">Pilotez ici l’ensemble de l’activité numérique : catalogue, formations, prestations, contenus et médias.</p>
        </div>
        <Link href="/pole-numerique" target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white">Voir la page publique <ArrowRight className="h-4 w-4" /></Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-black text-ink">{stat.value}</p>
            <p className="mt-2 text-sm font-bold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">Modules</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Gérer le pôle sans toucher au code</h2>
          <p className="mt-3 leading-7 text-slate-600">Chaque module alimente automatiquement la vitrine du Pôle numérique. Les produits, formations et contenus publiés remontent sur le site selon leur ordre et leur mise en avant.</p>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ href, label, text, icon: Icon }) => (
            <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-ocean"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-xl font-black text-ink">{label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-ocean">Ouvrir <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-dgNavy p-7 text-white sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-dgGold">Principe de publication</p>
        <h2 className="mt-3 text-2xl font-black">Le dashboard alimente la vitrine.</h2>
        <p className="mt-3 max-w-4xl leading-7 text-slate-300">Publiez ou modifiez les logiciels, formations, services et articles depuis leurs modules respectifs. La page Pôle numérique les utilise automatiquement pour présenter les offres les plus pertinentes, tout en conservant WhatsApp comme canal de conseil et de conversion.</p>
      </section>
    </div>
  );
}
