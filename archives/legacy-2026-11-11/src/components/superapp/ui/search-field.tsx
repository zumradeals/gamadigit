import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { cn } from './cn';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  placeholder: string;
  containerClassName?: string;
};

export function SearchField({ placeholder, containerClassName, className, ...props }: Props) {
  return (
    <div className={cn(
      'flex h-[3.25rem] items-center gap-3 rounded-tile border border-line bg-paper-card px-4 focus-within:border-line-strong',
      containerClassName,
    )}>
      <Search aria-hidden="true" className="h-[17px] w-[17px] shrink-0 text-slate-muted" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={props['aria-label'] ?? placeholder}
        className={cn('min-w-0 flex-1 border-none bg-transparent text-[0.95rem] outline-none placeholder:text-slate-muted', className)}
        {...props}
      />
    </div>
  );
}
