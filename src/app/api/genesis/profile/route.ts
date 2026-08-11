import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  CoreAccountError,
  parsePortalSession,
  portalAccountCookie,
  readCanonicalIdentity,
  readCurrentUserSession,
  serializePortalSession,
} from '@/lib/gamad-core/account';
import { identityResolutionFailure } from '@/lib/gamad-core/identity-state';
import { renewPortalSessionFromAttestation } from '@/lib/gamad-core/portal-session';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { parseCapabilityProfileInput } from '@/lib/profile/capability-profile';
import { createSupabaseServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

type RenewedSession = Parameters<typeof serializePortalSession>[0];

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

function withRenewedSession(response: NextResponse, session: RenewedSession) {
  response.cookies.set(portalAccountCookie.name, serializePortalSession(session), {
    ...portalAccountCookie.options,
    expires: new Date(session.expiresAt),
  });
  return response;
}

async function resolveActiveSession() {
  const session = await currentSession();
  if (!session) {
    return {
      response: NextResponse.json(
        { ok: false, error: 'NON_AUTHENTIFIE' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } },
      ),
    };
  }

  try {
    const identity = await readCanonicalIdentity(session);
    const attestation = await readCurrentUserSession(session);
    const renewed = renewPortalSessionFromAttestation(session, attestation);
    if (!renewed) throw new CoreAccountError('ATTESTATION_SESSION_INVALIDE', 502);
    return { session: renewed, identity };
  } catch (error) {
    const failure = identityResolutionFailure(error instanceof CoreAccountError ? error.status : undefined);
    const response = NextResponse.json(
      { ok: false, error: failure.error ?? 'NON_AUTHENTIFIE' },
      { status: failure.status, headers: { 'Cache-Control': 'no-store' } },
    );

    if (failure.clearPortalCookie) {
      response.cookies.set(portalAccountCookie.name, '', {
        ...portalAccountCookie.options,
        expires: new Date(0),
      });
    }

    return { response };
  }
}

export async function GET() {
  const auth = await resolveActiveSession();
  if ('response' in auth) return auth.response;

  const { session, identity } = auth;
  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return withRenewedSession(
      NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 }),
      session,
    );
  }

  const { data: row, error } = await supabase
    .from('dg_person_profiles')
    .select('display_name,country,city,phone,current_activity,education,skills,no_skills_yet,learning_goals,sectors,intentions,participation_mode,open_to_recommendations')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (error) {
    return withRenewedSession(
      NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 }),
      session,
    );
  }

  const displayName = identityDisplayName(identity) ?? row?.display_name ?? null;
  return withRenewedSession(NextResponse.json({
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
  }, { headers: { 'Cache-Control': 'no-store' } }), session);
}

export async function PATCH(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const auth = await resolveActiveSession();
  if ('response' in auth) return auth.response;

  const { session, identity } = auth;
  const raw = await request.json().catch(() => null);
  const body = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const value = parseCapabilityProfileInput(raw);
  if (!value) {
    return withRenewedSession(
      NextResponse.json({ ok: false, error: 'PROFIL_INVALIDE' }, { status: 422 }),
      session,
    );
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return withRenewedSession(
      NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 }),
      session,
    );
  }

  const { data: existing, error: existingError } = await supabase
    .from('dg_person_profiles')
    .select('country,city,phone,current_activity,education,skills,no_skills_yet,learning_goals,sectors,intentions,participation_mode,open_to_recommendations')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (existingError) {
    return withRenewedSession(
      NextResponse.json({ ok: false, error: 'PROFIL_INDISPONIBLE' }, { status: 503 }),
      session,
    );
  }

  const displayName = identityDisplayName(identity);
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
    return withRenewedSession(
      NextResponse.json({ ok: false, error: 'PROFIL_NON_ENREGISTRE' }, { status: 503 }),
      session,
    );
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

  return withRenewedSession(
    NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } }),
    session,
  );
}
