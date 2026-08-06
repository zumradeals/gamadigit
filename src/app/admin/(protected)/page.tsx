import { BookOpen, Boxes, Layers3, Users } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

async function countRows(table: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return count || 0;
}

export default async function AdminDashboardPage() {
  const [families, services, articles, leads] = await Promise.all([
    countRows('service_families'),
    countRows('services'),
    countRows('blog_posts'),
    countRows('leads'),
  ]);

  const cards = [
    ['Familles', families, Layers3],
    ['Services', services, Boxes],
    ['Articles', articles, BookOpen],
    ['Prospects', leads, Users],
  ] as const;

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Vue générale</p>
      <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Tableau de bord</h1>
      <p className="mt-3 text-slate-600">Les chiffres sont lus directement depuis Supabase.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><Icon className="h-6 w-6 text-ocean" /><p className="mt-5 text-3xl font-black text-ink">{value}</p><p className="mt-1 text-sm font-bold text-slate-500">{label}</p></div>)}
      </div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7"><h2 className="text-xl font-black text-ink">Étape suivante</h2><p className="mt-3 leading-7 text-slate-600">Les écrans de lecture sont prêts. Les formulaires de création, modification, publication et archivage seront ajoutés module par module.</p></div>
    </div>
  );
}
