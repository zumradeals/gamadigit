export function Logo({ src = '/brand/dg-afrique.svg', className = '' }: { src?: string; className?: string }) {
  return (
    <div className={`inline-flex min-w-0 items-center ${className}`} aria-label="DG AFRIQUE — Développement Global Afrique">
      <img
        src={src}
        alt="DG AFRIQUE — Développement Global Afrique"
        className="block h-10 w-auto max-w-[190px] rounded-lg bg-white px-2 py-1 object-contain sm:h-11 sm:max-w-[230px]"
      />
    </div>
  );
}
