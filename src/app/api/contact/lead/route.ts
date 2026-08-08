import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(200).or(z.literal('')).optional().default(''),
  customerType: z.string().trim().max(80).optional().default(''),
  familySlug: z.string().trim().max(120).optional().default(''),
  budgetLabel: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(5).max(5000),
  website: z.string().max(0).optional().default(''),
});

export async function POST(request: Request) {
  const rejected = rejectCrossOrigin(request);
  if (rejected) return rejected;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'REQUETE_INVALIDE' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'DONNEES_INVALIDES' }, { status: 422, headers: { 'Cache-Control': 'no-store' } });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'SERVICE_INDISPONIBLE' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  const data = parsed.data;
  const { error } = await supabase.from('leads').insert({
    full_name: data.fullName,
    phone: data.phone,
    email: data.email || null,
    customer_type: data.customerType || null,
    family_slug: data.familySlug || null,
    budget_label: data.budgetLabel || null,
    message: data.message,
    source: 'website',
  });

  if (error) {
    return NextResponse.json({ ok: false, error: 'ENREGISTREMENT_ECHOUE' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
