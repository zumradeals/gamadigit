import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import {
  hashZumraInviteToken,
  translateZumraDbError,
  ZumraEngineError,
} from '@/lib/zumra/groups';

export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  const mapped = error instanceof ZumraEngineError
    ? error
    : translateZumraDbError(error as { message?: string } | null);
  return NextResponse.json({ ok: false, error: mapped.code }, { status: mapped.status });
}

async function portalIdentity() {
  const jar = await cookies();
  return parsePortalSession(jar.get(portalAccountCookie.name)?.value)?.entity ?? null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const identity = await portalIdentity();
  if (!identity) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const { token } = await context.params;
  if (!token || token.length < 20) return NextResponse.json({ ok: false, error: 'INVITATION_INVALIDE' }, { status: 404 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const tokenHash = hashZumraInviteToken(token);
  const { data: invite, error: inviteError } = await supabase
    .from('zumra_group_invites')
    .select('zumra_id,status,expires_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (inviteError) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  if (!invite || invite.status !== 'open') return NextResponse.json({ ok: false, error: 'INVITATION_INVALIDE' }, { status: 404 });
  if (Date.parse(invite.expires_at) <= Date.now()) return NextResponse.json({ ok: false, error: 'INVITATION_EXPIREE' }, { status: 410 });

  const [groupResult, membershipResult] = await Promise.all([
    supabase
      .from('zumra_groups')
      .select('id,name,sector,objective,participation_mode,country,city,status')
      .eq('id', invite.zumra_id)
      .maybeSingle(),
    supabase
      .from('zumra_memberships')
      .select('status')
      .eq('core_identity_reference', identity)
      .maybeSingle(),
  ]);

  if (groupResult.error || membershipResult.error || !groupResult.data) {
    return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    group: {
      id: groupResult.data.id,
      name: groupResult.data.name,
      sector: groupResult.data.sector,
      objective: groupResult.data.objective,
      participationMode: groupResult.data.participation_mode,
      country: groupResult.data.country,
      city: groupResult.data.city,
      status: groupResult.data.status,
    },
    canAccept: membershipResult.data?.status === 'active',
    expiresAt: invite.expires_at,
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const identity = await portalIdentity();
  if (!identity) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const { token } = await context.params;
  if (!token || token.length < 20) return NextResponse.json({ ok: false, error: 'INVITATION_INVALIDE' }, { status: 404 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const { data, error } = await supabase.rpc('zumra_accept_invite', {
    p_token_hash: hashZumraInviteToken(token),
    p_actor: identity,
  });

  if (error) return errorResponse(error);
  return NextResponse.json({ ok: true, groupId: data }, { headers: { 'Cache-Control': 'no-store' } });
}
