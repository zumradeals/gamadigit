import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getGeniusPayment, type GeniusPayment } from '@/lib/geniuspay/server';

export type LocalZumraPayment = {
  reference: string;
  core_identity_reference: string;
  amount: number;
  currency: string;
  environment: string;
  status: string;
  checkout_url: string | null;
};

export async function reconcileZumraMembershipPayment(
  supabase: SupabaseClient,
  local: LocalZumraPayment,
  providerPayment?: GeniusPayment,
) {
  const remote = providerPayment ?? await getGeniusPayment(local.reference);
  if (remote.reference !== local.reference) throw new Error('GENIUSPAY_REFERENCE_INCOHERENTE');
  if (remote.amount !== local.amount) throw new Error('GENIUSPAY_MONTANT_INCOHERENT');
  if (local.currency !== 'XOF') throw new Error('GENIUSPAY_DEVISE_INCOHERENTE');
  if (local.environment !== 'sandbox' || (remote.environment && remote.environment !== 'sandbox')) {
    throw new Error('GENIUSPAY_ENVIRONNEMENT_INCOHERENT');
  }

  const { data, error } = await supabase.rpc('zumra_confirm_membership_payment', {
    p_reference: local.reference,
    p_provider_status: remote.status,
    p_provider_payload: remote.raw,
    p_fees: remote.fees ?? null,
    p_net_amount: remote.netAmount ?? null,
    p_completed_at: remote.completedAt ?? null,
  });
  if (error) throw new Error('ZUMRA_PAIEMENT_NON_RECONCILIE');

  const row = Array.isArray(data) ? data[0] : data;
  return {
    paymentStatus: remote.status,
    membershipStatus: row?.membership_status as string | undefined,
  };
}
