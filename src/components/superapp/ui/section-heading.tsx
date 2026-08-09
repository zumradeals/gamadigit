import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionHeadingProps = {
  title: string;
  aside?: ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeading({ title, aside, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-baseline justify-between gap-3', className)}>
      <div>
        <h2 className="font-display text-2xl font-normal tracking-[-0.015em]">{title}</h2>
        {description && <p className="mt-1.5 max-w-xl text-body text-slate-ink">{description}</p>}
      </div>
      {aside && <span className="text-meta text-slate-muted">{aside}</span>}
    </div>
  );
}

type EyebrowProps = {
  children: ReactNode;
  tone?: 'gold' | 'muted';
  className?: string;
};

export function Eyebrow({ children, tone = 'gold', className }: EyebrowProps) {
  return (
    <span className={cn(
      'font-mono text-label uppercase tracking-[0.1em]',
      tone === 'gold' ? 'text-gold' : 'text-slate-muted',
      className,
    )}>
      {children}
    </span>
  );
}
