'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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

export async function saveBlogCategoryAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const name = text(formData, 'name');
  const payload = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().nullable(),
    sort_order: z.number().int(),
    status: z.enum(['draft', 'published', 'archived']),
  }).parse({
    name,
    slug: slugify(text(formData, 'slug') || name),
    description: nullableText(formData, 'description'),
    sort_order: Number(text(formData, 'sort_order') || 0),
    status: text(formData, 'status') || 'draft',
  });

  const query = id
    ? supabase.from('blog_categories').update(payload).eq('id', id)
    : supabase.from('blog_categories').insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
  revalidatePath('/admin/articles');
  revalidatePath('/blog');
}

export async function saveMenuAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const payload = z.object({
    name: z.string().min(2),
    location: z.string().min(2),
    status: z.enum(['draft', 'published', 'archived']),
  }).parse({
    name: text(formData, 'name'),
    location: slugify(text(formData, 'location')),
    status: text(formData, 'status') || 'draft',
  });

  const query = id
    ? supabase.from('menus').update(payload).eq('id', id)
    : supabase.from('menus').insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath('/admin/navigation');
  revalidatePath('/', 'layout');
}

export async function saveMenuItemAction(formData: FormData) {
  const supabase = await adminClient();
  const id = nullableText(formData, 'id');
  const payload = z.object({
    menu_id: z.string().uuid(),
    parent_id: z.string().uuid().nullable(),
    label: z.string().min(1),
    url: z.string().min(1),
    target: z.enum(['_self', '_blank']),
    sort_order: z.number().int(),
    status: z.enum(['draft', 'published', 'archived']),
  }).parse({
    menu_id: text(formData, 'menu_id'),
    parent_id: nullableText(formData, 'parent_id'),
    label: text(formData, 'label'),
    url: text(formData, 'url'),
    target: text(formData, 'target') || '_self',
    sort_order: Number(text(formData, 'sort_order') || 0),
    status: text(formData, 'status') || 'draft',
  });

  if (id && payload.parent_id === id) throw new Error('Un élément ne peut pas être son propre parent.');

  if (payload.parent_id) {
    const { data: parent, error: parentError } = await supabase
      .from('menu_items')
      .select('menu_id, parent_id')
      .eq('id', payload.parent_id)
      .maybeSingle();
    if (parentError || !parent) throw new Error('Le parent sélectionné est introuvable.');
    if (parent.menu_id !== payload.menu_id) throw new Error('Le parent doit appartenir au même menu.');
    if (parent.parent_id) throw new Error('Les menus sont limités à deux niveaux dans la V1.');
  }

  const query = id
    ? supabase.from('menu_items').update(payload).eq('id', id)
    : supabase.from('menu_items').insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath('/admin/navigation');
  revalidatePath('/', 'layout');
}

export async function updateMediaAction(formData: FormData) {
  const supabase = await adminClient();
  const id = z.string().uuid().parse(text(formData, 'id'));
  const altText = nullableText(formData, 'alt_text');
  const { error } = await supabase.from('media_assets').update({ alt_text: altText }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/medias');
}

export async function deleteMediaAction(formData: FormData) {
  const supabase = await adminClient();
  const id = z.string().uuid().parse(text(formData, 'id'));
  const storagePath = z.string().min(1).parse(text(formData, 'storage_path'));

  const { error: storageError } = await supabase.storage.from('media').remove([storagePath]);
  if (storageError) throw new Error(storageError.message);
  const { error } = await supabase.from('media_assets').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/medias');
}
