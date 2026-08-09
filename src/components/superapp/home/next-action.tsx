import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow, ProgressBar, SuperButtonLink } from '@/components/superapp/ui';

export type NextAction = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  progress?: number;
  progressLabel?: string;
};

export function NextActionCard({ action }: { action: NextAction }) {
  return (
    <section className="rounded-card border border-gold-line bg-[linear-gradient(180deg,#FFFDF8,#FBF6EA)] p-[1.375rem]">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-[16rem] flex-1">
          <Eyebrow>{action.eyebrow}</Eyebrow>
          <h2 className="mb-2 mt-2.5 text-[1.18rem] font-semibold tracking-[-0.012em]">{action.title}</h2>
          <p className="max-w-xl text-body text-slate-ink">{action.description}</p>
        </div>
        <SuperButtonLink as={Link} href={action.href} className="shrink-0">
          {action.cta}<ArrowRight aria-hidden="true" className="h-4 w-4" />
        </SuperButtonLink>
      </div>
      {typeof action.progress === 'number' && (
        <div className="mt-5 flex items-center gap-3.5">
          <ProgressBar className="flex-1 bg-[#EAE2D0]" segments={[{ pct: action.progress, className: 'bg-gold' }]} />
          <span className="shrink-0 font-mono text-meta text-[#7A5518]">{action.progressLabel ?? `${action.progress} %`}</span>
        </div>
      )}
    </section>
  );
}
