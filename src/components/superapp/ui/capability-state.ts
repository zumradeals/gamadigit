export const capabilityStates = ['ok', 'learning', 'missing', 'intent', 'empty', 'plain'] as const;
export type CapabilityState = (typeof capabilityStates)[number];

export const capabilityStateClasses: Record<CapabilityState, string> = {
  ok: 'border border-jade-line bg-jade-100 text-jade-700',
  learning: 'border border-gold-line bg-gold-50 text-gold',
  missing: 'border border-dashed border-clay-line bg-clay-100 text-clay-700',
  intent: 'border border-[#C6D2E4] bg-[#F2F6FB] text-sky-700',
  empty: 'border border-dashed border-line-strong bg-transparent text-slate-muted',
  plain: 'border border-line bg-paper text-slate-line2',
};

export const capabilityStateLabels: Record<CapabilityState, string> = {
  ok: 'Disponible',
  learning: "En cours d'apprentissage",
  missing: 'Recherchée, non couverte',
  intent: 'Intention',
  empty: 'Non renseigné',
  plain: '',
};
