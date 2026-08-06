import Link from 'next/link';
import { AdminShell } from '@/components/admin/admin-shell';
import { LogoutButton } from '@/components/admin/logout-button';
import { requireAdmin } from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  if (session.status === 'unconfigured') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan">Configuration requise</p>
          <h1 className="mt-3 text-3xl font-black">Connectez le projet Supabase GamaDigit.</h1>
          <p className="mt-4 leading-7 text-slate-400">Renseignez les variables d’environnement, appliquez la migration puis créez le premier profil administrateur.</p>
          <Link href="/" className="mt-7 inline-block rounded-xl bg-cyan px-5 py-3 font-black text-ink">Retour au site</Link>
        </div>
      </main>
    );
  }

  if (session.status === 'forbidden') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-lg rounded-3xl border border-red-400/20 bg-red-500/5 p-8">
          <h1 className="text-3xl font-black">Accès non autorisé</h1>
          <p className="mt-4 leading-7 text-slate-400">Le compte {session.email || ''} est authentifié mais ne possède pas le rôle administrateur.</p>
          <div className="mt-6 max-w-52"><LogoutButton /></div>
        </div>
      </main>
    );
  }

  return <AdminShell email={session.email} role={session.role}>{children}</AdminShell>;
}
