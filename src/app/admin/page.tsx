import { BookOpen, Boxes, FileText, LayoutDashboard, Settings, Users } from 'lucide-react';

const modules = [
  ['Contenus et pages', LayoutDashboard],
  ['Familles et services', Boxes],
  ['Articles de blog', BookOpen],
  ['Demandes de devis', Users],
  ['Médias et documents', FileText],
  ['Paramètres du site', Settings],
] as const;

export default function AdminPage() {
  return (
    <section className="min-h-[70vh] bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">Back-office GamaDigit</p><h1 className="mt-4 text-4xl font-black">Administration en construction</h1><p className="mt-4 max-w-2xl leading-7 text-slate-400">Le socle fonctionnel est posé. Les écrans seront reliés à Supabase avec authentification et rôles administrateurs.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(([label, Icon]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6"><Icon className="h-6 w-6 text-cyan" /><p className="mt-4 font-black">{label}</p><p className="mt-2 text-sm text-slate-500">Module prévu pour la V1 configurable.</p></div>)}</div></div>
    </section>
  );
}
