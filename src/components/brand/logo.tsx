import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="DG AFRIQUE — Développement Global Afrique">
      <Image src="/brand/dg-afrique-provisoire.svg" alt="DG AFRIQUE" width={52} height={52} className="h-12 w-12 rounded-xl object-cover" priority />
      <span className="hidden leading-none sm:block">
        <span className="block text-lg font-black tracking-[-0.03em] text-dgNavy">DG AFRIQUE</span>
        <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Développement Global Afrique</span>
      </span>
    </div>
  );
}
