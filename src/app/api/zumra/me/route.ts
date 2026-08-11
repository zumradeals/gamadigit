import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

type ProfileRow = Record<string, unknown> | null;

function arrayValue(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function textValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function profilePayload(canonical: ProfileRow, legacy: ProfileRow) {
  if (!canonical && !legacy) return undefined;

  const source = canonical ?? legacy;
  const participation = textValue(legacy?.participation_mode)
    ?? textValue(canonical?.participation_mode)
    ?? 'both';

  return {
    displayName: textValue(canonical?.display_name) ?? textValue(legacy?.display_name),
    country: textValue(canonical?.country) ?? textValue(legacy?.country) ?? '',
    city: textValue(canonical?.city) ?? textValue(legacy?.city) ?? '',
    phone: textValue(canonical?.phone) ?? textValue(legacy?.phone) ?? '',
    skills: canonical ? arrayValue(canonical.skills) : arrayValue(legacy?.skills),
    noSkillsYet: canonical ? Boolean(canonical.no_skills_yet) : Boolean(legacy?.no_skills_yet),
    learningGoals: canonical ? arrayValue(canonical.learning_goals) : arrayValue(legacy?.learning_goals),
    currentActivity: textValue(canonical?.current_activity) ?? textValue(legacy?.current_activity),
    education: textValue(canonical?.education) ?? textValue(legacy?.education),
    sectors: canonical ? arrayValue(canonical.sectors) : arrayValue(legacy?.sectors),
    // Les intentions ZUMRA restent propres au parcours d'adhésion et ne sont pas
    // remplacées par les intentions libres du profil DG.
    intentions: legacy ? arrayValue(legacy.intentions) : [],
    participationMode: participation === 'physical' || participation === 'digital' ? participation : 'both',
    openToRecommendations: canonical
      ? canonical.open_to_recommendations !== false
      : legacy?.open_to_recommendations !== false,
  };
}

export async function GET() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (!session) {
    return NextResponse.json({ ok: false, enrolled: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, enrolled: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  const { data: membership, error: membershipError } = await supabase
    .from('zumra_memberships')
    .select('status,charter_version,charter_accepted_at,member_since,contribution_status')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (membershipError) {
    return NextResponse.json({ ok: false, enrolled: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  if (!membership) {
    return NextResponse.json({
      ok: true,
      enrolled: false,
      coreIdentityReference: session.entity,
    }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const [{ data: canonical, error: canonicalError }, { data: legacy, error: legacyError }] = await Promise.all([
    supabase
      .from('dg_person_profiles')
      .select('display_name,country,city,phone,skills,no_skills_yet,learning_goals,current_activity,education,sectors,participation_mode,open_to_recommendations')
      .eq('core_identity_reference', session.entity)
      .maybeSingle(),
    supabase
      .from('zumra_member_profiles')
      .select('display_name,country,city,phone,skills,no_skills_yet,learning_goals,current_activity,education,sectors,intentions,participation_mode,open_to_recommendations')
      .eq('core_identity_reference', session.entity)
      .maybeSingle(),
  ]);

  if (canonicalError || legacyError) {
    return NextResponse.json({ ok: false, enrolled: true, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    enrolled: true,
    coreIdentityReference: session.entity,
    membership: {
      status: membership.status,
      charterVersion: membership.charter_version,
      charterAcceptedAt: membership.charter_accepted_at,
      memberSince: membership.member_since,
      contributionStatus: membership.contribution_status,
    },
    profile: profilePayload(canonical, legacy),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
