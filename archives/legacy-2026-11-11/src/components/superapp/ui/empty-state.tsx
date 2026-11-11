import { SuperButton } from './button';
import { Eyebrow } from './section-heading';

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  cta?: string;
  onAction?: () => void;
};

/** Un état vide doit proposer une prochaine action plutôt que simuler une erreur. */
export function EmptyState({ eyebrow, title, description, cta, onAction }: Props) {
  return (
    <div className="max-w-xl py-10">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-display text-3xl font-normal tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 text-lead text-slate-ink">{description}</p>
      {cta && <SuperButton className="mt-6" onClick={onAction}>{cta}</SuperButton>}
    </div>
  );
}
