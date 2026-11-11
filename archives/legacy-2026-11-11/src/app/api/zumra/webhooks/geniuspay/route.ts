import { NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { getGeniusPayment, verifyGeniusWebhook } from '@/lib/geniuspay/server';
import { reconcileZumraMembershipPayment, type LocalZumraPayment } from '@/lib/geniuspay/zumra';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get('X-GeniusPay-Signature');
  if (!verifyGeniusWebhook(raw, signature)) {
    return NextResponse.json({ ok: false, error: 'SIGNATURE_INVALIDE' }, { status: 401 });
  }

  const payload = JSON.parse(raw) as {
    event?: string;
    data?: { transaction?: { reference?: string } };
  };
  const reference = payload.data?.transaction?.reference;
  if (!reference) return NextResponse.json({ ok: false, error: 'REFERENCE_MANQUANTE' }, { status: 422 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const { data: local, error } = await supabase
    .from('zumra_payments')
    .select('reference,core_identity_reference,amount,currency,environment,status,checkout_url')
    .eq('reference', reference)
    .eq('provider', 'geniuspay')
    .eq('purpose', 'membership')
    .maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: 'PAIEMENT_INDISPONIBLE' }, { status: 503 });
  if (!local) return NextResponse.json({ ok: true, ignored: true });

  try {
    const remote = await getGeniusPayment(reference);
    await reconcileZumraMembershipPayment(supabase, local as LocalZumraPayment, remote);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'CONFIRMATION_GENIUSPAY_ECHOUEE' }, { status: 503 });
  }
}
