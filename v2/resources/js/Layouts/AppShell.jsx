import { usePage } from '@inertiajs/react';
import { primaryNav } from '../config/navigation';
import TopBar from './TopBar';
import NavRail from './NavRail';
import MobileTabBar from './MobileTabBar';

export default function AppShell({ current, children }) {
  const { auth } = usePage().props;
  const user = auth?.user || auth?.account || auth || null;
  return <div className="min-h-screen bg-paper text-ink">
    <TopBar user={user} />
    <div className="mx-auto flex max-w-[97.5rem] items-start">
      {user && <NavRail items={primaryNav} current={current} />}
      <main className={`min-w-0 flex-1 ${user ? 'pb-24 lg:pb-0' : ''}`}>{children}</main>
    </div>
    {user && <MobileTabBar items={primaryNav} current={current} />}
  </div>;
}
