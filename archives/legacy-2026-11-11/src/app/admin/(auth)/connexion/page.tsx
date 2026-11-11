import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = { title: 'Connexion administration' };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">GamaDigit</p>
        <h1 className="mt-3 text-3xl font-black">Accès au back-office</h1>
        <p className="mt-3 leading-7 text-slate-400">Connectez-vous avec le compte autorisé dans la table des profils administrateurs.</p>
        <LoginForm />
        <Link href="/" className="mt-6 block text-center text-sm font-bold text-slate-500 hover:text-white">Retour au site public</Link>
      </div>
    </main>
  );
}
