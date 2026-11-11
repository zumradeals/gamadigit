import type { HTMLAttributes } from 'react';
import { capabilityStateClasses, type CapabilityState } from './capability-state';
import { cn } from './cn';

type Props = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  state?: CapabilityState;
};

/** Unité atomique du produit. La couleur représente un état de capacité, jamais un score humain. */
export function CapabilityChip({ label, state = 'plain', className, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-chip px-2.5 py-[5px] font-mono text-[0.72rem] leading-none',
        capabilityStateClasses[state],
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}
