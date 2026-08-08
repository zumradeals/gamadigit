import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { translateZumraDbError, ZumraEngineError } from '@/lib/zumra/groups';

export const dynamic = 'force-dynamic';

const schema = z.object({
  targetIdentity: z.string().trim().min(4).max(200),
  role: z.enum(['deputy_1', 'deputy_2', 'finance', 'social']),
});

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

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: 'FORMULAIRE_INVALIDE' }, { status: 422 });

  const { id } = await context.params;
  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const { data, error } = await supabase.rpc('zumra_assign_founding_role', {
    p_zumra_id: id,
    p_actor: session.entity,
    p_target: parsed.data.targetIdentity,
    p_role: parsed.data.role,
  });

  if (error) return errorResponse(error);
  return NextResponse.json({ ok: true, status: data }, { headers: { 'Cache-Control': 'no-store' } });
}
