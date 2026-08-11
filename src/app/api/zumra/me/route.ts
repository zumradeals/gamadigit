import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

function profilePayload(profile: Record<string, unknown> | null) {
  if (!profile) return undefined;

  return {
    displayName: typeof profile.display_name === 'string' ? profile.display_name : null,
    country: typeof profile.country === 'string' ? profile.country : '',
    city: typeof profile.city === 'string' ? profile.city : '',
    phone: typeof profile.phone === 'string' ? profile.phone : '',
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    noSkillsYet: Boolean(profile.no_skills_yet),
    learningGoals: Array.isArray(profile.learning_goals) ? profile.learning_goals : [],
    currentActivity: typeof profile.current_activity === 'string' ? profile.current_activity : null,
    education: typeof profile.education === 'string' ? profile.education : null,
    sectors: Array.isArray(profile.sectors) ? profile.sectors : [],
    intentions: Array.isArray(profile.intentions) ? profile.intentions : [],
    participationMode: profile.participation_mode === 'physical' || profile.participation_mode === 'digital'
      ? profile.participation_mode
      : 'both',
    openToRecommendations: profile.open_to_recommendations !== false,
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

  const [{ data: profile, error: profileError }, { data: membership, error: membershipError }] = await Promise.all([
    supabase
      .from('dg_person_profiles')
      .select('display_name,country,city,phone,skills,no_skills_yet,learning_goals,current_activity,education,sectors,intentions,participation_mode,open_to_recommendations')
      .eq('core_identity_reference', session.entity)
      .maybeSingle(),
    supabase
      .from('zumra_memberships')
      .select('status,charter_version,charter_accepted_at,member_since,contribution_status')
      .eq('core_identity_reference', session.entity)
      .maybeSingle(),
  ]);

  if (membershipError || profileError) {
    return NextResponse.json({ ok: false, enrolled: Boolean(membership), error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  if (!membership) {
    return NextResponse.json({
      ok: true,
      enrolled: false,
      coreIdentityReference: session.entity,
      profile: profilePayload(profile),
    }, { headers: { 'Cache-Control': 'no-store' } });
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
    profile: profilePayload(profile),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
