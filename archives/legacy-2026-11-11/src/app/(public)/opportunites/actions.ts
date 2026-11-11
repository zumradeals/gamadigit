'use server';

import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const submissionSchema = z.object({
  title: z.string().trim().min(5).max(160),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().max(5000).optional().default(''),
  sector: z.string().trim().min(2).max(120),
  country: z.string().trim().min(2).max(120),
  city: z.string().trim().max(120).optional().default(''),
  opportunity_type: z.enum(['business', 'project', 'supplier', 'buyer', 'investment', 'partnership']),
  looking_for: z.string().trim().min(5).max(1000),
  submitter_name: z.string().trim().min(2).max(120),
  submitter_organization: z.string().trim().max(160).optional().default(''),
  submitter_phone: z.string().trim().min(6).max(40),
  submitter_email: z.string().trim().email().max(200).or(z.literal('')).optional().default(''),
});

function makeSlug(title: string) {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'opportunite';
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function submitOpportunityAction(formData: FormData) {
  const parsed = submissionSchema.safeParse({
    title: formData.get('title'),
    summary: formData.get('summary'),
    description: formData.get('description'),
    sector: formData.get('sector'),
    country: formData.get('country'),
    city: formData.get('city'),
    opportunity_type: formData.get('opportunity_type'),
    looking_for: formData.get('looking_for'),
    submitter_name: formData.get('submitter_name'),
    submitter_organization: formData.get('submitter_organization'),
    submitter_phone: formData.get('submitter_phone'),
    submitter_email: formData.get('submitter_email'),
  });

  if (!parsed.success) redirect('/opportunites?depot=erreur#deposer');

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect('/opportunites?depot=erreur#deposer');

  const data = parsed.data;
  const { error } = await supabase.from('opportunities').insert({
    slug: makeSlug(data.title),
    title: data.title,
    summary: data.summary,
    description: data.description,
    sector: data.sector,
    country: data.country,
    city: data.city || null,
    opportunity_type: data.opportunity_type,
    looking_for: data.looking_for,
    status: 'open',
    publication_status: 'draft',
    published_at: null,
    submission_source: 'public',
    submitter_name: data.submitter_name,
    submitter_organization: data.submitter_organization || null,
    submitter_phone: data.submitter_phone,
    submitter_email: data.submitter_email || null,
    contact_message: `Bonjour DG AFRIQUE, je suis intéressé par l'opportunité : ${data.title}.`,
  });

  if (error) redirect('/opportunites?depot=erreur#deposer');

  revalidatePath('/admin/opportunites');
  redirect('/opportunites?depot=ok#deposer');
}
