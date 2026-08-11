import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { parsePortalSession, portalAccountCookie, readCanonicalIdentity } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { parseCapabilityProfileInput } from '@/lib/profile/capability-profile';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

function identityDisplayName(identity: Record<string, unknown>) {
  for (const key of ['denomination', 'nom', 'libelle']) {
    const value = identity[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

async function currentSession() {
  const jar = await cookies();
  return parsePortalSession(jar.get(portalAccountCookie.name)?.value);
}

function owns(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

export async function GET() {
  const session = await currentSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 });
  }

  const { data: row, error } = await supabase
    .from('dg_person_profiles')
    .select('display_name,country,city,phone,current_activity,education,skills,no_skills_yet,learning_goals,sectors,intentions,participation_mode,open_to_recommendations')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 });
  }

  let displayName = row?.display_name ?? null;
  try {
    displayName = identityDisplayName(await readCanonicalIdentity(session)) ?? displayName;
  } catch {
    // Le profil métier reste lisible si le libellé Core est temporairement indisponible.
  }

  return NextResponse.json({
    ok: true,
    profile: {
      exists: Boolean(row),
      displayName,
      country: row?.country ?? null,
      city: row?.city ?? null,
      phone: row?.phone ?? null,
      currentActivity: row?.current_activity ?? null,
      education: row?.education ?? null,
      skills: row?.skills ?? [],
      noSkillsYet: Boolean(row?.no_skills_yet),
      learningGoals: row?.learning_goals ?? [],
      sectors: row?.sectors ?? [],
      intentions: row?.intentions ?? [],
      participationMode: row?.participation_mode ?? null,
      openToRecommendations: row ? Boolean(row.open_to_recommendations) : true,
    },
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const session = await currentSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });
  }

  const raw = await request.json().catch(() => null);
  const body = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const value = parseCapabilityProfileInput(raw);
  if (!value) {
    return NextResponse.json({ ok: false, error: 'PROFIL_INVALIDE' }, { status: 422 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 });
  }

  const { data: existing, error: existingError } = await supabase
    .from('dg_person_profiles')
    .select('country,city,phone,current_activity,education,skills,no_skills_yet,learning_goals,sectors,intentions,participation_mode,open_to_recommendations')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 });
  }

  let displayName: string | null = null;
  try {
    displayName = identityDisplayName(await readCanonicalIdentity(session));
  } catch {
    // Le nom canonique n'est pas requis pour enregistrer les données métier du profil.
  }

  const now = new Date().toISOString();
  const payload = {
    core_identity_reference: session.entity,
    ...(displayName ? { display_name: displayName } : {}),
    country: owns(body, 'country') ? value.country : existing?.country ?? null,
    city: owns(body, 'city') ? value.city : existing?.city ?? null,
    phone: owns(body, 'phone') ? value.phone : existing?.phone ?? null,
    current_activity: owns(body, 'currentActivity') ? value.currentActivity : existing?.current_activity ?? null,
    education: owns(body, 'education') ? value.education : existing?.education ?? null,
    skills: owns(body, 'skills') || owns(body, 'noSkillsYet') ? value.skills : existing?.skills ?? [],
    no_skills_yet: owns(body, 'noSkillsYet') ? value.noSkillsYet : Boolean(existing?.no_skills_yet),
    learning_goals: owns(body, 'learningGoals') ? value.learningGoals : existing?.learning_goals ?? [],
    sectors: owns(body, 'sectors') ? value.sectors : existing?.sectors ?? [],
    intentions: owns(body, 'intentions') ? value.intentions : existing?.intentions ?? [],
    participation_mode: owns(body, 'participationMode') ? value.participationMode : existing?.participation_mode ?? null,
    open_to_recommendations: owns(body, 'openToRecommendations')
      ? value.openToRecommendations
      : existing ? Boolean(existing.open_to_recommendations) : true,
    updated_at: now,
  };

  const { error } = await supabase
    .from('dg_person_profiles')
    .upsert(payload, { onConflict: 'core_identity_reference' });

  if (error) {
    return NextResponse.json({ ok: false, error: 'PROFIL_NON_ENREGISTRE' }, { status: 503 });
  }

  // Pont de compatibilité temporaire : si la personne possède déjà un profil ZUMRA,
  // on synchronise les champs réellement partagés sans créer d'adhésion ni écraser
  // les intentions spécifiques au parcours ZUMRA.
  const { data: legacy } = await supabase
    .from('zumra_member_profiles')
    .select('country,city,phone,participation_mode')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (legacy) {
    await supabase
      .from('zumra_member_profiles')
      .update({
        ...(displayName ? { display_name: displayName } : {}),
        country: payload.country ?? legacy.country,
        city: payload.city ?? legacy.city,
        phone: payload.phone ?? legacy.phone,
        current_activity: payload.current_activity,
        education: payload.education,
        skills: payload.skills,
        no_skills_yet: payload.no_skills_yet,
        learning_goals: payload.learning_goals,
        sectors: payload.sectors,
        participation_mode: payload.participation_mode ?? legacy.participation_mode,
        open_to_recommendations: payload.open_to_recommendations,
        updated_at: now,
      })
      .eq('core_identity_reference', session.entity);
  }

  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
