import Link from 'next/link';
import {
  BookOpen,
  Boxes,
  FolderTree,
  Home,
  Images,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { LogoutButton } from '@/components/admin/logout-button';

const navigation = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/accueil', label: 'Page d’accueil', icon: Home },
  { href: '/admin/navigation', label: 'Menus', icon: Menu },
  { href: '/admin/services', label: 'Services', icon: Boxes },
  { href: '/admin/logiciels', label: 'Logiciels', icon: Package },
  { href: '/admin/articles', label: 'Articles', icon: BookOpen },
  { href: '/admin/categories', label: 'Catégories', icon: FolderTree },
  { href: '/admin/medias', label: 'Médias', icon: Images },
  { href: '/admin/prospects', label: 'Prospects', icon: Users },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

export function AdminShell({ children, email, role }: { children: React.ReactNode; email: string | null; role: string }) {
  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="bg-[#041726] p-4 text-white lg:min-h-screen lg:p-5">
        <Link href="/" className="inline-block rounded-xl bg-white p-2"><Logo className="h-10 w-auto" /></Link>
        <p className="mt-5 px-3 text-xs font-black uppercase tracking-[0.16em] text-cyan">Administration</p>
        <nav className="mt-4 space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white"><Icon className="h-4 w-4" />{label}</Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="px-3 text-xs text-slate-500">{email || 'Administrateur'}</p>
          <p className="mt-1 px-3 text-xs font-bold uppercase tracking-wider text-mint">{role}</p>
          <div className="mt-2"><LogoutButton /></div>
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-7 lg:p-10">{children}</main>
    </div>
  );
}
