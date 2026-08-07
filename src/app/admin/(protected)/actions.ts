'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-auth';
import { parseBlogEditorText } from '@/lib/blog-content';
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

export async function saveFamilyAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const name = text(formData, 'name');
  const parsed = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    short_name: z.string().min(2),
    eyebrow: z.string().nullable(),
    description: z.string().min(10),
    icon: z.string().nullable(),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    status: statusSchema,
    sort_order: z.number().int(),
  }).parse({
    name,
    slug: slugify(text(formData, 'slug') || name),
    short_name: text(formData, 'short_name') || name,
    eyebrow: nullableText(formData, 'eyebrow'),
    description: text(formData, 'description'),
    icon: nullableText(formData, 'icon'),
    accent: text(formData, 'accent') || '#0877C9',
    status: text(formData, 'status') || 'draft',
    sort_order: Number(text(formData, 'sort_order') || 0),
  });

  const query = id
    ? supabase.from('service_families').update(parsed).eq('id', id)
    : supabase.from('service_families').insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function saveServiceAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const name = text(formData, 'name');
  const features = text(formData, 'features')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const parsed = z.object({
    family_id: z.string().uuid(),
    name: z.string().min(2),
    slug: z.string().min(2),
    excerpt: z.string().min(10),
    description: z.string().min(10),
    price_label: z.string().nullable(),
    delivery_label: z.string().nullable(),
    features: z.array(z.string()),
    whatsapp_message: z.string().nullable(),
    status: statusSchema,
    is_featured: z.boolean(),
    sort_order: z.number().int(),
    published_at: z.string().nullable(),
  }).parse({
    family_id: text(formData, 'family_id'),
    name,
    slug: slugify(text(formData, 'slug') || name),
    excerpt: text(formData, 'excerpt'),
    description: text(formData, 'description'),
    price_label: nullableText(formData, 'price_label'),
    delivery_label: nullableText(formData, 'delivery_label'),
    features,
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

  revalidatePath('/');
  revalidatePath('/admin/services');
}

export async function saveBlogPostAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const title = text(formData, 'title');
  const content = parseBlogEditorText(text(formData, 'content'));

  const parsed = z.object({
    category_id: z.string().uuid().nullable(),
    title: z.string().min(4),
    slug: z.string().min(2),
    excerpt: z.string().min(10),
    content: z.array(z.unknown()).min(1),
    author_name: z.string().nullable(),
    read_time: z.string().nullable(),
    status: statusSchema,
    published_at: z.string().nullable(),
    seo_title: z.string().nullable(),
    seo_description: z.string().nullable(),
  }).parse({
    category_id: nullableText(formData, 'category_id'),
    title,
    slug: slugify(text(formData, 'slug') || title),
    excerpt: text(formData, 'excerpt'),
    content,
    author_name: nullableText(formData, 'author_name'),
    read_time: nullableText(formData, 'read_time'),
    status: text(formData, 'status') || 'draft',
    published_at: text(formData, 'status') === 'published' ? new Date().toISOString() : null,
    seo_title: nullableText(formData, 'seo_title'),
    seo_description: nullableText(formData, 'seo_description'),
  });

  const query = id
    ? supabase.from('blog_posts').update(parsed).eq('id', id)
    : supabase.from('blog_posts').insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath('/blog');
  revalidatePath('/admin/articles');
  if (parsed.status === 'published') revalidatePath(`/blog/${parsed.slug}`);
}

export async function updateLeadStatusAction(formData: FormData) {
  const supabase = await adminClient();
  const id = z.string().uuid().parse(text(formData, 'id'));
  const status = z.enum(['new', 'contacted', 'quoted', 'negotiating', 'won', 'lost']).parse(text(formData, 'status'));
  const notes = nullableText(formData, 'notes');
  const { error } = await supabase.from('leads').update({ status, notes }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/prospects');
}

export async function saveSettingsAction(formData: FormData) {
  const supabase = await adminClient();
  const payload = z.object({
    name: z.string().min(2),
    tagline: z.string().min(4),
    ecosystemLabel: z.string().min(4),
    whatsappNumber: z.string().min(6),
    phone: z.string().min(6),
    email: z.string().email(),
    location: z.string().min(2),
  }).parse({
    name: text(formData, 'name'),
    tagline: text(formData, 'tagline'),
    ecosystemLabel: text(formData, 'ecosystemLabel'),
    whatsappNumber: text(formData, 'whatsappNumber'),
    phone: text(formData, 'phone'),
    email: text(formData, 'email'),
    location: text(formData, 'location'),
  });

  const { error } = await supabase.from('site_settings').upsert({ id: 'main', payload });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/parametres');
}
