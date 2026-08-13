import type { HTMLAttributes } from 'react';
import { cn } from './cn';

type Props = HTMLAttributes<HTMLDivElement> & {
  tone?: 'light' | 'dark';
  interactive?: boolean;
};

export function SuperCard({ tone = 'light', interactive = false, className, ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-[1.125rem] border p-5 shadow-sm sm:p-[1.375rem]',
        tone === 'dark' ? 'border-ink-500/40 bg-ink text-white' : 'border-border bg-white',
        interactive && 'cursor-pointer text-left transition-colors hover:border-ink',
        className,
      )}
      {...props}
    />
  );
}
