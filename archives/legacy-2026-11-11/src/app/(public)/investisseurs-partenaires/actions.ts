'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function submitRelationshipInquiryAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Service indisponible');
  const payload = {
    inquiry_type: String(formData.get('inquiry_type') || 'partner'),
    organization: String(formData.get('organization') || '').trim(),
    full_name: String(formData.get('full_name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    email: String(formData.get('email') || '').trim() || null,
    country: String(formData.get('country') || '').trim(),
    sectors: String(formData.get('sectors') || '').trim() || null,
    criteria: String(formData.get('criteria') || '').trim() || null,
    message: String(formData.get('message') || '').trim(),
  };
  const { error } = await supabase.from('partnership_inquiries').insert(payload);
  if (error) throw new Error(error.message);
}
