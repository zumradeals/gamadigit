import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/brand/gamadigit-logo.svg"
      alt="GamaDigit"
      width={260}
      height={64}
      priority
      className={className}
    />
  );
}
