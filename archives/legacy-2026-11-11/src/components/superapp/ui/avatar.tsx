import { cn } from './cn';

const sizes = {
  sm: 'h-7 w-7 rounded-lg text-[0.72rem]',
  md: 'h-9 w-9 rounded-xl text-[0.78rem]',
  lg: 'h-[4.875rem] w-[4.875rem] rounded-[1.375rem] font-display text-[1.75rem]',
} as const;

const tones = {
  ink: 'bg-ink text-gold-100',
  warm: 'bg-paper-warm text-slate-line2',
} as const;

type Props = {
  initials: string;
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
  className?: string;
};

export function Avatar({ initials, size = 'md', tone = 'ink', className }: Props) {
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center font-semibold', sizes[size], tones[tone], className)}>
      {initials}
    </span>
  );
}
