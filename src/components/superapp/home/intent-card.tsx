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
      className="focus-ring group flex min-h-[8.25rem] flex-col gap-2.5 rounded-[1.125rem] border border-border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-ocean/30 hover:shadow-floating"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud text-ocean transition group-hover:bg-ocean group-hover:text-white">
        <Icon aria-hidden="true" className="h-[17px] w-[17px]" />
      </span>
      <strong className="text-[1.03rem] font-extrabold tracking-[-0.01em] text-ink">{intent.label}</strong>
      <span className="text-body text-muted">{intent.description}</span>
    </Link>
  );
}
