import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parsePortalSession, portalAccountCookie, readCanonicalIdentity } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServiceClient } from '@/lib/supabase/service';
import { ZUMRA_CHARTER_VERSION } from '@/lib/zumra/types';

export const dynamic = 'force-dynamic';

const cleanText = z.string().trim().min(1).max(120);
const shortList = z.array(z.string().trim().min(1).max(80)).max(20);

const enrollmentSchema = z.object({
  country: cleanText,
  city: cleanText,
  phone: z.string().trim().min(5).max(30),
  skills: shortList,
  noSkillsYet: z.boolean(),
  learningGoals: shortList,
  currentActivity: z.string().trim().max(160).optional().default(''),
  education: z.string().trim().max(160).optional().default(''),
  sectors: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
  intentions: z.array(z.enum(['join', 'create', 'recommended', 'learn'])).min(1).max(4),
  participationMode: z.enum(['physical', 'digital', 'both']),
  openToRecommendations: z.boolean(),
  charterAccepted: z.literal(true),
}).superRefine((value, context) => {
  if (!value.noSkillsYet && value.skills.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['skills'],
      message: 'Indiquez au moins une competence ou cochez que vous souhaitez commencer de zero.',
    });
  }
});

function identityDisplayName(identity: Record<string, unknown>) {
  for (const key of ['denomination', 'nom', 'libelle']) {
    const value = identity[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'NON_AUTHENTIFIE' }, { status: 401 });
  }

  const parsed = enrollmentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({
      ok: false,
      error: 'FORMULAIRE_INVALIDE',
      fields: parsed.error.flatten().fieldErrors,
    }, { status: 422 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  const now = new Date().toISOString();
  const { data: existing, error: existingError } = await supabase
    .from('zumra_memberships')
    .select('status')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ ok: false, error: 'ZUMRA_INDISPONIBLE' }, { status: 503 });
  }

  if (!existing) {
    const { error } = await supabase.from('zumra_memberships').insert({
      core_identity_reference: session.entity,
      status: 'pending_payment',
      charter_version: ZUMRA_CHARTER_VERSION,
      charter_accepted_at: now,
      contribution_status: 'not_started',
    });
    if (error) {
      return NextResponse.json({ ok: false, error: 'ADHESION_NON_ENREGISTREE' }, { status: 503 });
    }
  } else {
    const { error } = await supabase
      .from('zumra_memberships')
      .update({ charter_version: ZUMRA_CHARTER_VERSION, charter_accepted_at: now })
      .eq('core_identity_reference', session.entity);
    if (error) {
      return NextResponse.json({ ok: false, error: 'ADHESION_NON_ENREGISTREE' }, { status: 503 });
    }
  }

  let displayName: string | null = null;
  try {
    displayName = identityDisplayName(await readCanonicalIdentity(session));
  } catch {
    // Le profil reste enregistrable si le libelle Core est temporairement indisponible.
  }

  const { data: existingCanonical, error: canonicalReadError } = await supabase
    .from('dg_person_profiles')
    .select('intentions')
    .eq('core_identity_reference', session.entity)
    .maybeSingle();

  if (canonicalReadError) {
    return NextResponse.json({ ok: false, error: 'PROFIL_DG_INDISPONIBLE' }, { status: 503 });
  }

  const value = parsed.data;
  const sharedProfile = {
    ...(displayName ? { display_name: displayName } : {}),
    country: value.country,
    city: value.city,
    phone: value.phone,
    skills: value.noSkillsYet ? [] : value.skills,
    no_skills_yet: value.noSkillsYet,
    learning_goals: value.learningGoals,
    current_activity: value.currentActivity || null,
    education: value.education || null,
    sectors: value.sectors,
    participation_mode: value.participationMode,
    open_to_recommendations: value.openToRecommendations,
    updated_at: now,
  };

  const canonicalIntentions = existingCanonical
    ? (Array.isArray(existingCanonical.intentions) ? existingCanonical.intentions : [])
    : value.intentions;

  const { error: canonicalProfileError } = await supabase
    .from('dg_person_profiles')
    .upsert({
      core_identity_reference: session.entity,
      ...sharedProfile,
      intentions: canonicalIntentions,
    }, { onConflict: 'core_identity_reference' });

  if (canonicalProfileError) {
    return NextResponse.json({ ok: false, error: 'PROFIL_DG_NON_ENREGISTRE' }, { status: 503 });
  }

  const { error: profileError } = await supabase
    .from('zumra_member_profiles')
    .upsert({
      core_identity_reference: session.entity,
      ...sharedProfile,
      intentions: value.intentions,
    }, { onConflict: 'core_identity_reference' });

  if (profileError) {
    return NextResponse.json({ ok: false, error: 'PROFIL_NON_ENREGISTRE' }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    status: existing?.status ?? 'pending_payment',
    paymentRequired: (existing?.status ?? 'pending_payment') === 'pending_payment',
  }, { status: existing ? 200 : 201, headers: { 'Cache-Control': 'no-store' } });
}
