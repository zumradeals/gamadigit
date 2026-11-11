'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function saveOpportunityAction(formData: FormData) {
  const session = await requireAdmin();
  if (session.status !== 'authorized') throw new Error('Accès refusé');
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase non configuré');

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const payload = {
    title,
    slug: slugify(String(formData.get('slug') || title)),
    summary: String(formData.get('summary') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    sector: String(formData.get('sector') || '').trim(),
    country: String(formData.get('country') || '').trim(),
    city: String(formData.get('city') || '').trim() || null,
    opportunity_type: String(formData.get('opportunity_type') || 'business'),
    looking_for: String(formData.get('looking_for') || '').trim(),
    status: String(formData.get('status') || 'open'),
    publication_status: String(formData.get('publication_status') || 'draft'),
    contact_message: String(formData.get('contact_message') || '').trim() || null,
    sort_order: Number(formData.get('sort_order') || 0),
    published_at: String(formData.get('publication_status') || 'draft') === 'published' ? new Date().toISOString() : null,
  };

  if (!title || !payload.summary || !payload.sector || !payload.country || !payload.looking_for) throw new Error('Champs obligatoires manquants');
  const query = id ? supabase.from('opportunities').update(payload).eq('id', id) : supabase.from('opportunities').insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath('/opportunites');
  revalidatePath('/admin/opportunites');
}

export async function updateInquiryAction(formData: FormData) {
  const session = await requireAdmin();
  if (session.status !== 'authorized') throw new Error('Accès refusé');
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase non configuré');
  const { error } = await supabase.from('partnership_inquiries').update({
    status: String(formData.get('status') || 'new'),
    notes: String(formData.get('notes') || '').trim() || null,
  }).eq('id', String(formData.get('id') || ''));
  if (error) throw new Error(error.message);
  revalidatePath('/admin/opportunites');
}
