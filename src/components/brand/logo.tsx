import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`} aria-label="DG AFRIQUE — Développement Global Afrique">
      <Image
        src="/brand/dg-afrique.svg"
        alt="DG AFRIQUE — Développement Global Afrique"
        width={460}
        height={130}
        className="h-14 w-auto object-contain sm:h-16"
        priority
      />
    </div>
  );
}
