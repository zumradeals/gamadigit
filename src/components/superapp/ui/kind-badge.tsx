import { cn } from './cn';

export const objectKinds = ['FORMATION', 'OPPORTUNITÉ', 'PROJET', 'ZUMRA', 'CAPACITÉ', 'SERVICE', 'PERSONNE'] as const;
export type ObjectKind = (typeof objectKinds)[number];

const objectKindClasses: Record<ObjectKind, string> = {
  FORMATION: 'bg-sky-100 text-sky-700',
  OPPORTUNITÉ: 'bg-gold-100 text-[#7A5518]',
  PROJET: 'bg-jade-100 text-jade-700',
  ZUMRA: 'bg-ink text-gold-100',
  CAPACITÉ: 'bg-paper-warm text-slate-line2',
  SERVICE: 'bg-paper-warm text-slate-line2',
  PERSONNE: 'bg-paper-warm text-slate-line2',
};

type Props = {
  kind: ObjectKind;
  className?: string;
};

export function KindBadge({ kind, className }: Props) {
  return (
    <span className={cn(
      'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-mono text-[0.66rem] tracking-[0.06em]',
      objectKindClasses[kind],
      className,
    )}>
      {kind}
    </span>
  );
}
