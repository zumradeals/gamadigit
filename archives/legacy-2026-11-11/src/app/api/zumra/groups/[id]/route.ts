import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { loadZumraGroupDetail, translateZumraDbError, ZumraEngineError } from '@/lib/zumra/groups';

export const dynamic = 'force-dynamic';

function errorResponse(error: unknown) {
  const mapped = error instanceof ZumraEngineError
    ? error
    : translateZumraDbError(error as { message?: string } | null);
  return NextResponse.json({ ok: false, error: mapped.code }, { status: mapped.status });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);
  if (!session) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const { id } = await context.params;
  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  try {
    const detail = await loadZumraGroupDetail(supabase, id, session.entity);
    return NextResponse.json({ ok: true, ...detail }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}
