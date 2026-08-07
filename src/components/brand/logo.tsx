export function Logo({ src = '/brand/dg-afrique.svg', className = '' }: { src?: string; className?: string }) {
  return (
    <div className={`inline-flex min-w-0 items-center ${className}`} aria-label="DG AFRIQUE — Développement Global Afrique">
      <img
        src={src}
        alt="DG AFRIQUE — Développement Global Afrique"
        className="block h-12 w-auto max-w-[260px] object-contain sm:h-14 sm:max-w-[360px]"
      />
    </div>
  );
}
