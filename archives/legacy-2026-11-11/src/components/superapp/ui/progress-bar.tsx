import { cn } from './cn';

type Segment = {
  pct: number;
  className: string;
};

type Props = {
  segments?: Segment[];
  height?: string;
  className?: string;
};

export function ProgressBar({ segments = [], height = 'h-[6px]', className }: Props) {
  return (
    <div className={cn('flex overflow-hidden rounded-full bg-line-soft', height, className)}>
      {segments.map((segment, index) => (
        <div
          key={`${segment.className}-${index}`}
          className={cn('h-full', segment.className)}
          style={{ width: `${Math.max(0, Math.min(100, segment.pct))}%` }}
        />
      ))}
    </div>
  );
}
