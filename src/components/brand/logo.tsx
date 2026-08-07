export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="DG AFRIQUE — Développement Global Afrique">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-sm font-black tracking-tight text-amber shadow-sm">DG</span>
      <span className="leading-none">
        <span className="block text-lg font-black tracking-[-0.03em] text-ink">DG AFRIQUE</span>
        <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Développement Global Afrique</span>
      </span>
    </div>
  );
}
