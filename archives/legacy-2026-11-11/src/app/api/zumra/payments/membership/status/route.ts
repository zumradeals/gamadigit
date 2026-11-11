import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { reconcileZumraMembershipPayment, type LocalZumraPayment } from '@/lib/geniuspay/zumra';

export const dynamic = 'force-dynamic';

export async function GET() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);
  if (!session) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const { data: membership } = await supabase
    .from('zumra_memberships')
    .select('status')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();
  if (membership?.status === 'active') {
    return NextResponse.json({ ok: true, membershipStatus: 'active', paymentStatus: 'completed' }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const { data: payment, error } = await supabase
    .from('zumra_payments')
    .select('reference,core_identity_reference,amount,currency,environment,status,checkout_url')
    .eq('core_identity_reference', session.entity)
    .eq('provider', 'geniuspay')
    .eq('purpose', 'membership')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: 'PAIEMENT_INDISPONIBLE' }, { status: 503 });
  if (!payment) return NextResponse.json({ ok: true, membershipStatus: membership?.status ?? null, paymentStatus: null });

  try {
    const reconciled = await reconcileZumraMembershipPayment(supabase, payment as LocalZumraPayment);
    return NextResponse.json({ ok: true, ...reconciled, reference: payment.reference }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: true, membershipStatus: membership?.status ?? null, paymentStatus: payment.status, reference: payment.reference }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
