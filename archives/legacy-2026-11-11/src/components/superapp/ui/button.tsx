import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react';
import { cn } from './cn';

const variants = {
  primary: 'border border-ink bg-ink text-paper hover:border-ink-700 hover:bg-ink-700',
  secondary: 'border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-paper-card',
  gold: 'border border-gold-400 bg-gold-400 text-[#1E1405] hover:border-[#C9974C] hover:bg-[#C9974C]',
  onDark: 'border border-ink-500 bg-transparent text-paper hover:border-ink-300',
  dashed: 'border border-dashed border-[#C9B98F] bg-transparent text-gold hover:border-gold',
  ghost: 'border-none bg-transparent text-gold hover:underline',
} as const;

const sizes = {
  sm: 'h-10 px-4 text-[0.84rem]',
  md: 'h-[2.6rem] px-[1.15rem] text-[0.86rem]',
  lg: 'h-[3.1rem] px-[1.6rem] text-[0.95rem]',
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
};

export function SuperButton({ variant = 'primary', size = 'md', className, type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors',
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export type SuperButtonLinkProps = {
  as: ElementType;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

export function SuperButtonLink({ as: Component, variant = 'primary', size = 'md', className, ...props }: SuperButtonLinkProps) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
