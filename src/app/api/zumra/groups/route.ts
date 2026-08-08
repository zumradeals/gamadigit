import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import {
  loadMyZumraGroups,
  translateZumraDbError,
  ZumraEngineError,
} from '@/lib/zumra/groups';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sector: z.string().trim().min(2).max(120),
  objective: z.string().trim().min(10).max(1000),
  participationMode: z.enum(['physical', 'digital', 'both']),
  country: z.string().trim().max(120).optional().default(''),
  city: z.string().trim().max(120).optional().default(''),
}).superRefine((value, context) => {
  if (value.participationMode !== 'digital' && (!value.country || !value.city)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['city'],
      message: 'Une Zumra physique ou hybride doit indiquer sa localisation.',
    });
  }
});

function errorResponse(error: unknown) {
  const mapped = error instanceof ZumraEngineError
    ? error
    : translateZumraDbError(error as { message?: string } | null);
  return NextResponse.json({ ok: false, error: mapped.code }, { status: mapped.status });
}

async function sessionIdentity() {
  const jar = await cookies();
  return parsePortalSession(jar.get(portalAccountCookie.name)?.value)?.entity ?? null;
}

export async function GET() {
  const identity = await sessionIdentity();
  if (!identity) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  try {
    const groups = await loadMyZumraGroups(supabase, identity);
    return NextResponse.json({ ok: true, groups }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const identity = await sessionIdentity();
  if (!identity) return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'FORMULAIRE_INVALIDE' }, { status: 422 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });

  const value = parsed.data;
  const { data, error } = await supabase.rpc('zumra_create_group', {
    p_actor: identity,
    p_name: value.name,
    p_sector: value.sector,
    p_objective: value.objective,
    p_participation_mode: value.participationMode,
    p_country: value.country,
    p_city: value.city,
  });

  if (error) return errorResponse(error);
  return NextResponse.json({ ok: true, groupId: data }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
