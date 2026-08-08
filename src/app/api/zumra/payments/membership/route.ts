import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { createGeniusMembershipPayment, getGeniusPayConfig } from '@/lib/geniuspay/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);
  if (!session) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const { data: membership, error: membershipError } = await supabase
    .from('zumra_memberships')
    .select('status')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();
  if (membershipError || !membership) return NextResponse.json({ ok: false, error: 'ADHESION_ZUMRA_INTROUVABLE' }, { status: 404 });
  if (membership.status === 'active') return NextResponse.json({ ok: true, alreadyActive: true });
  if (membership.status !== 'pending_payment') return NextResponse.json({ ok: false, error: 'ADHESION_NON_PAYABLE' }, { status: 409 });

  const { data: profile } = await supabase
    .from('zumra_member_profiles')
    .select('display_name,phone')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  try {
    const origin = new URL(request.url).origin;
    const payment = await createGeniusMembershipPayment({
      coreIdentityReference: session.entity,
      customerName: profile?.display_name ?? null,
      customerPhone: profile?.phone ?? null,
      successUrl: `${origin}/espace/zumra/paiement?retour=success`,
      errorUrl: `${origin}/espace/zumra/paiement?retour=error`,
    });
    const config = getGeniusPayConfig();
    const checkoutUrl = payment.checkoutUrl || payment.paymentUrl || null;

    const { error } = await supabase.from('zumra_payments').insert({
      core_identity_reference: session.entity,
      provider: 'geniuspay',
      purpose: 'membership',
      reference: payment.reference,
      provider_id: payment.id == null ? null : String(payment.id),
      amount: payment.amount,
      currency: 'XOF',
      environment: 'sandbox',
      status: payment.status,
      checkout_url: checkoutUrl,
      fees: payment.fees ?? null,
      net_amount: payment.netAmount ?? null,
      provider_payload: payment.raw,
    });
    if (error) return NextResponse.json({ ok: false, error: 'PAIEMENT_NON_ENREGISTRE' }, { status: 503 });

    return NextResponse.json({
      ok: true,
      reference: payment.reference,
      checkoutUrl,
      amount: config.membershipFeeXof,
      currency: 'XOF',
      environment: 'sandbox',
    }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'GENIUSPAY_INDISPONIBLE';
    const configurationError = code.includes('MANQUANT') || code.includes('REQUIS') || code.includes('CLES_SANDBOX');
    return NextResponse.json({ ok: false, error: configurationError ? 'GENIUSPAY_NON_CONFIGURE' : 'GENIUSPAY_INDISPONIBLE' }, { status: 503 });
  }
}
