import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export type HomeIntent = {
  id: 'learn' | 'explore' | 'build' | 'produce';
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function IntentCard({ intent }: { intent: HomeIntent }) {
  const Icon = intent.icon;
  return (
    <Link
      href={intent.href}
      className="flex min-h-[7.875rem] flex-col gap-2.5 rounded-card border border-line bg-paper-card p-5 text-left transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <span className="flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-[0.625rem] bg-gold-100 text-[#7A5518]">
        <Icon aria-hidden="true" className="h-[17px] w-[17px]" />
      </span>
      <strong className="text-[1.03rem] font-semibold tracking-[-0.01em]">{intent.label}</strong>
      <span className="text-body text-slate-ink">{intent.description}</span>
    </Link>
  );
}
