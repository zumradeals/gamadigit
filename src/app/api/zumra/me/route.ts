import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

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

  const { data: profile, error: profileError } = await supabase
    .from('zumra_member_profiles')
    .select('display_name,country,city,phone,skills,no_skills_yet,learning_goals,current_activity,education,sectors,intentions,participation_mode,open_to_recommendations')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (profileError) {
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
    profile: profile ? {
      displayName: profile.display_name,
      country: profile.country,
      city: profile.city,
      phone: profile.phone,
      skills: profile.skills ?? [],
      noSkillsYet: Boolean(profile.no_skills_yet),
      learningGoals: profile.learning_goals ?? [],
      currentActivity: profile.current_activity,
      education: profile.education,
      sectors: profile.sectors ?? [],
      intentions: profile.intentions ?? [],
      participationMode: profile.participation_mode,
      openToRecommendations: Boolean(profile.open_to_recommendations),
    } : undefined,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
