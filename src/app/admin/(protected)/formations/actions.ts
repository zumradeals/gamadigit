'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const statusSchema = z.enum(['draft', 'published', 'archived']);
const kindSchema = z.enum(['software', 'career_pack']);

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

function revalidateTrainingCatalogue() {
  revalidatePath('/');
  revalidatePath('/formations');
  revalidatePath('/admin/formations');
}

export async function saveTrainingCategoryAction(formData: FormData) {
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
    ? supabase.from('training_categories').update(parsed).eq('id', id)
    : supabase.from('training_categories').insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidateTrainingCatalogue();
}

export async function saveTrainingProgramAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const name = text(formData, 'name');
  const highlights = text(formData, 'highlights')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const imageUrl = nullableText(formData, 'image_url');
  const imageAlt = nullableText(formData, 'image_alt') || name;
  const status = text(formData, 'status') || 'draft';

  const parsed = z.object({
    category_id: z.string().uuid(),
    slug: z.string().min(2),
    name: z.string().min(2),
    kind: kindSchema,
    excerpt: z.string().min(10),
    description: z.string().min(10),
    price_label: z.string().nullable(),
    show_price: z.boolean(),
    format_label: z.string().nullable(),
    duration_label: z.string().nullable(),
    highlights: z.array(z.string()),
    media: z.array(z.object({ url: z.string().url(), alt: z.string() })),
    whatsapp_message: z.string().nullable(),
    partner_label: z.string().nullable(),
    is_featured: z.boolean(),
    sort_order: z.number().int(),
    status: statusSchema,
    published_at: z.string().nullable(),
  }).parse({
    category_id: text(formData, 'category_id'),
    slug: slugify(text(formData, 'slug') || name),
    name,
    kind: text(formData, 'kind') || 'software',
    excerpt: text(formData, 'excerpt'),
    description: text(formData, 'description'),
    price_label: nullableText(formData, 'price_label'),
    show_price: formData.get('show_price') === 'on',
    format_label: nullableText(formData, 'format_label'),
    duration_label: nullableText(formData, 'duration_label'),
    highlights,
    media: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
    whatsapp_message: nullableText(formData, 'whatsapp_message'),
    partner_label: nullableText(formData, 'partner_label'),
    is_featured: formData.get('is_featured') === 'on',
    sort_order: Number(text(formData, 'sort_order') || 0),
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
  });

  const query = id
    ? supabase.from('training_programs').update(parsed).eq('id', id)
    : supabase.from('training_programs').insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidateTrainingCatalogue();
}
