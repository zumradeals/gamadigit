'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const statusSchema = z.enum(['draft', 'published', 'archived']);

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function adminClient() {
  const session = await getAdminSession();
  if (session.status !== 'authorized') throw new Error('Accès administrateur requis.');
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase n’est pas configuré.');
  return supabase;
}

function revalidateCatalogue() {
  revalidatePath('/');
  revalidatePath('/logiciels');
  revalidatePath('/services/logiciels-abonnements');
  revalidatePath('/admin/logiciels');
  revalidatePath('/admin/services');
}

export async function saveSoftwareCategoryAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const name = text(formData, 'name');
  const parsed = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().nullable(),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    sort_order: z.number().int(),
    status: statusSchema,
  }).parse({
    name,
    slug: slugify(text(formData, 'slug') || name),
    description: nullableText(formData, 'description'),
    accent: text(formData, 'accent') || '#0877C9',
    sort_order: Number(text(formData, 'sort_order') || 0),
    status: text(formData, 'status') || 'draft',
  });

  const query = id
    ? supabase.from('software_categories').update(parsed).eq('id', id)
    : supabase.from('software_categories').insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidateCatalogue();
}

export async function saveSoftwareProductAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const name = text(formData, 'name');
  const features = text(formData, 'features')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const imageUrl = nullableText(formData, 'image_url');
  const imageAlt = nullableText(formData, 'image_alt') || name;

  const { data: family, error: familyError } = await supabase
    .from('service_families')
    .select('id')
    .eq('slug', 'logiciels-abonnements')
    .single();
  if (familyError || !family) throw new Error('La famille Logiciels et abonnements est introuvable.');

  const parsed = z.object({
    family_id: z.string().uuid(),
    software_category_id: z.string().uuid(),
    product_code: z.string().nullable(),
    name: z.string().min(2),
    slug: z.string().min(2),
    excerpt: z.string().min(10),
    description: z.string().min(10),
    price_label: z.string().nullable(),
    delivery_label: z.string().nullable(),
    features: z.array(z.string()),
    media: z.array(z.object({ url: z.string().url(), alt: z.string() })),
    whatsapp_message: z.string().nullable(),
    status: statusSchema,
    is_featured: z.boolean(),
    sort_order: z.number().int(),
    published_at: z.string().nullable(),
  }).parse({
    family_id: family.id,
    software_category_id: text(formData, 'software_category_id'),
    product_code: nullableText(formData, 'product_code'),
    name,
    slug: slugify(text(formData, 'slug') || name),
    excerpt: text(formData, 'excerpt'),
    description: text(formData, 'description'),
    price_label: nullableText(formData, 'price_label'),
    delivery_label: nullableText(formData, 'delivery_label'),
    features,
    media: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
    whatsapp_message: nullableText(formData, 'whatsapp_message'),
    status: text(formData, 'status') || 'draft',
    is_featured: formData.get('is_featured') === 'on',
    sort_order: Number(text(formData, 'sort_order') || 0),
    published_at: text(formData, 'status') === 'published' ? new Date().toISOString() : null,
  });

  const query = id
    ? supabase.from('services').update(parsed).eq('id', id)
    : supabase.from('services').insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidateCatalogue();
}
