import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { hashZumraInviteToken, translateZumraDbError, ZumraEngineError } from '@/lib/zumra/groups';

export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  const mapped = error instanceof ZumraEngineError
    ? error
    : translateZumraDbError(error as { message?: string } | null);
  return NextResponse.json({ ok: false, error: mapped.code }, { status: mapped.status });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);
  if (!session) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const { id } = await context.params;
  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const token = crypto.randomBytes(24).toString('base64url');
  const tokenHash = hashZumraInviteToken(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.rpc('zumra_create_invite', {
    p_zumra_id: id,
    p_actor: session.entity,
    p_token_hash: tokenHash,
    p_expires_at: expiresAt,
  });

  if (error) return errorResponse(error);
  return NextResponse.json({
    ok: true,
    inviteId: data,
    token,
    expiresAt,
  }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
