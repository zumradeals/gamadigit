'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

async function adminClient() {
  const session = await getAdminSession();
  if (session.status !== 'authorized') throw new Error('Accès administrateur requis.');
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase n’est pas configuré.');
  return supabase;
}

const baseSchema = z.object({
  sectionKey: z.enum([
    'hero',
    'promises',
    'process',
    'families_intro',
    'offers_intro',
    'blog_intro',
    'final_cta',
  ]),
  status: z.enum(['draft', 'published', 'archived']),
  sortOrder: z.number().int(),
});

function buildPayload(sectionKey: string, formData: FormData) {
  switch (sectionKey) {
    case 'hero':
      return z.object({
        badge: z.string().min(3),
        title: z.string().min(5),
        highlight: z.string(),
        description: z.string().min(10),
        primaryLabel: z.string().min(2),
        primaryMessage: z.string().min(5),
        secondaryLabel: z.string().min(2),
      }).parse({
        badge: text(formData, 'badge'),
        title: text(formData, 'title'),
        highlight: text(formData, 'highlight'),
        description: text(formData, 'description'),
        primaryLabel: text(formData, 'primaryLabel'),
        primaryMessage: text(formData, 'primaryMessage'),
        secondaryLabel: text(formData, 'secondaryLabel'),
      });

    case 'promises':
      return z.object({ items: z.array(z.string().min(2)).min(1).max(6) }).parse({
        items: text(formData, 'items')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      });

    case 'process': {
      const stepNumbers = formData.getAll('stepNumber').map(String);
      const stepTitles = formData.getAll('stepTitle').map(String);
      const stepTexts = formData.getAll('stepText').map(String);
      const steps = stepTitles
        .map((title, index) => ({
          number: stepNumbers[index]?.trim() || String(index + 1).padStart(2, '0'),
          title: title.trim(),
          text: stepTexts[index]?.trim() || '',
        }))
        .filter((step) => step.title && step.text);

      return z.object({
        eyebrow: z.string().min(2),
        title: z.string().min(5),
        steps: z.array(z.object({
          number: z.string().min(1),
          title: z.string().min(2),
          text: z.string().min(4),
        })).min(1).max(6),
      }).parse({
        eyebrow: text(formData, 'eyebrow'),
        title: text(formData, 'title'),
        steps,
      });
    }

    case 'families_intro':
      return z.object({
        eyebrow: z.string().min(2),
        title: z.string().min(5),
        description: z.string().min(10),
      }).parse({
        eyebrow: text(formData, 'eyebrow'),
        title: text(formData, 'title'),
        description: text(formData, 'description'),
      });

    case 'offers_intro':
      return z.object({
        eyebrow: z.string().min(2),
        title: z.string().min(5),
        linkLabel: z.string().min(2),
      }).parse({
        eyebrow: text(formData, 'eyebrow'),
        title: text(formData, 'title'),
        linkLabel: text(formData, 'linkLabel'),
      });

    case 'blog_intro':
      return z.object({
        eyebrow: z.string().min(2),
        title: z.string().min(5),
        description: z.string().min(10),
      }).parse({
        eyebrow: text(formData, 'eyebrow'),
        title: text(formData, 'title'),
        description: text(formData, 'description'),
      });

    case 'final_cta':
      return z.object({
        title: z.string().min(5),
        description: z.string().min(10),
        buttonLabel: z.string().min(2),
        whatsappMessage: z.string().min(5),
      }).parse({
        title: text(formData, 'title'),
        description: text(formData, 'description'),
        buttonLabel: text(formData, 'buttonLabel'),
        whatsappMessage: text(formData, 'whatsappMessage'),
      });

    default:
      throw new Error('Section inconnue.');
  }
}

export async function saveHomepageSectionAction(formData: FormData) {
  const supabase = await adminClient();
  const parsed = baseSchema.parse({
    sectionKey: text(formData, 'sectionKey'),
    status: text(formData, 'status') || 'draft',
    sortOrder: Number(text(formData, 'sortOrder') || 0),
  });
  const payload = buildPayload(parsed.sectionKey, formData);

  const { error } = await supabase.from('page_sections').upsert(
    {
      page_slug: 'home',
      section_key: parsed.sectionKey,
      payload,
      sort_order: parsed.sortOrder,
      status: parsed.status,
    },
    { onConflict: 'page_slug,section_key' }
  );

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/accueil');
}
