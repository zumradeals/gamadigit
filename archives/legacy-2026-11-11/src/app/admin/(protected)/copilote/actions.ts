'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { buildCopilotPrompts } from '@/lib/ai/prompts';
import { callAiProvider } from '@/lib/ai/provider';
import { formatCopilotResult, parseCopilotResult } from '@/lib/ai/result';
import type {
  AiRuntimeProvider,
  CopilotBrandSettings,
  CopilotGenerationResult,
} from '@/lib/ai/types';
import { getAdminSession } from '@/lib/admin-auth';
import { articleResultToBlocks } from '@/lib/blog-content';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || undefined;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'contenu';
}

function resultString(result: Record<string, unknown>, key: string) {
  return typeof result[key] === 'string' ? String(result[key]).trim() : '';
}

function resultStrings(result: Record<string, unknown>, key: string) {
  return Array.isArray(result[key])
    ? (result[key] as unknown[]).map(String).map((item) => item.trim()).filter(Boolean)
    : [];
}

async function adminClient() {
  const session = await getAdminSession();
  if (session.status !== 'authorized') throw new Error('Accès administrateur requis.');

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error('Supabase n’est pas configuré.');

  return supabase;
}

const providerKeySchema = z.enum(['deepseek', 'openai', 'anthropic']);
const apiStyleSchema = z.enum(['openai_chat', 'openai_responses', 'anthropic_messages']);
const optionalUuidSchema = z.preprocess(
  (value) => value === '' || value == null ? undefined : value,
  z.string().uuid().optional(),
);

export async function saveAiProviderAction(formData: FormData) {
  const supabase = await adminClient();
  const providerKey = providerKeySchema.parse(text(formData, 'provider_key'));
  const apiKey = text(formData, 'api_key');
  const requestedEnabled = formData.get('enabled') === 'on';

  const parsed = z.object({
    display_name: z.string().min(2),
    api_style: apiStyleSchema,
    base_url: z.string().url(),
    model: z.string().min(2),
    priority: z.number().int().min(0).max(999),
  }).parse({
    display_name: text(formData, 'display_name'),
    api_style: text(formData, 'api_style'),
    base_url: text(formData, 'base_url'),
    model: text(formData, 'model'),
    priority: Number(text(formData, 'priority') || 100),
  });

  const { data: current } = await supabase
    .from('ai_providers')
    .select('secret_id')
    .eq('provider_key', providerKey)
    .maybeSingle();

  const hasSecret = Boolean(current?.secret_id || apiKey);
  const { error: updateError } = await supabase
    .from('ai_providers')
    .update({
      ...parsed,
      enabled: requestedEnabled && hasSecret,
      last_test_message: requestedEnabled && !hasSecret
        ? 'Ajoutez une clé API avant d’activer ce moteur.'
        : null,
    })
    .eq('provider_key', providerKey);

  if (updateError) throw new Error(updateError.message);

  if (apiKey) {
    const { error: secretError } = await supabase.rpc('admin_set_ai_provider_secret', {
      p_provider_key: providerKey,
      p_secret: apiKey,
    });
    if (secretError) throw new Error(secretError.message);

    if (requestedEnabled) {
      const { error: enableError } = await supabase
        .from('ai_providers')
        .update({ enabled: true })
        .eq('provider_key', providerKey);
      if (enableError) throw new Error(enableError.message);
    }
  }

  revalidatePath('/admin/copilote');
}

export async function removeAiProviderKeyAction(formData: FormData) {
  const supabase = await adminClient();
  const providerKey = providerKeySchema.parse(text(formData, 'provider_key'));
  const { error } = await supabase.rpc('admin_delete_ai_provider_secret', {
    p_provider_key: providerKey,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/copilote');
}

async function runtimeProvider(providerKey: string) {
  const supabase = await adminClient();
  const { data, error } = await supabase.rpc('admin_get_ai_provider_runtime', {
    p_provider_key: providerKey,
  });

  if (error) throw new Error(error.message);
  const provider = Array.isArray(data) ? data[0] : data;
  if (!provider) throw new Error('Ce moteur IA n’est pas configuré.');
  if (!provider.api_key) throw new Error('Ajoutez une clé API depuis le tableau de bord.');
  return { supabase, provider: provider as AiRuntimeProvider };
}

export async function testAiProviderAction(formData: FormData) {
  const providerKey = providerKeySchema.parse(text(formData, 'provider_key'));
  const supabase = await adminClient();

  try {
    const runtime = await runtimeProvider(providerKey);
    const output = await callAiProvider({
      provider: runtime.provider,
      systemPrompt: 'Tu vérifies une connexion API. Réponds sans explication.',
      userPrompt: 'Réponds uniquement par OK.',
      maxOutputTokens: 40,
    });

    const { error } = await supabase
      .from('ai_providers')
      .update({
        last_tested_at: new Date().toISOString(),
        last_test_status: 'success',
        last_test_message: output.slice(0, 120) || 'Connexion réussie.',
      })
      .eq('provider_key', providerKey);
    if (error) throw new Error(error.message);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Échec du test de connexion.';
    await supabase
      .from('ai_providers')
      .update({
        last_tested_at: new Date().toISOString(),
        last_test_status: 'error',
        last_test_message: message.slice(0, 300),
      })
      .eq('provider_key', providerKey);
  }

  revalidatePath('/admin/copilote');
}

export async function saveAiSettingsAction(formData: FormData) {
  const supabase = await adminClient();
  const payload = z.object({
    brandName: z.string().min(2),
    defaultLanguage: z.enum(['fr', 'en', 'ar']),
    defaultTone: z.enum(['commercial', 'pedagogique', 'professionnel', 'direct']),
    brandVoice: z.string().min(10),
    businessContext: z.string().min(20),
    editorialRules: z.string().min(20),
  }).parse({
    brandName: text(formData, 'brandName'),
    defaultLanguage: text(formData, 'defaultLanguage'),
    defaultTone: text(formData, 'defaultTone'),
    brandVoice: text(formData, 'brandVoice'),
    businessContext: text(formData, 'businessContext'),
    editorialRules: text(formData, 'editorialRules'),
  });

  const { error } = await supabase.from('ai_settings').upsert({ id: 'main', payload });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/copilote');
}

export type CopilotDraftContext = {
  contentType: 'product' | 'article' | 'social';
  targetProductId?: string;
  softwareCategoryId?: string;
  blogCategoryId?: string;
};

export type CopilotActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  generationId?: string;
  provider?: string;
  model?: string;
  result?: CopilotGenerationResult;
  formatted?: string;
  draftContext?: CopilotDraftContext;
};

export async function generateCopilotContentAction(
  _previousState: CopilotActionState,
  formData: FormData,
): Promise<CopilotActionState> {
  try {
    const parsed = z.object({
      providerKey: providerKeySchema,
      contentType: z.enum(['product', 'article', 'social']),
      language: z.enum(['fr', 'en', 'ar']),
      tone: z.enum(['commercial', 'pedagogique', 'professionnel', 'direct']),
      brief: z.string().min(20, 'Le brief doit contenir au moins 20 caractères.').max(12_000),
      targetProductId: optionalUuidSchema,
      softwareCategoryId: optionalUuidSchema,
      blogCategoryId: optionalUuidSchema,
    }).parse({
      providerKey: text(formData, 'provider_key'),
      contentType: text(formData, 'content_type'),
      language: text(formData, 'language'),
      tone: text(formData, 'tone'),
      brief: text(formData, 'brief'),
      targetProductId: optionalText(formData, 'target_product_id'),
      softwareCategoryId: optionalText(formData, 'software_category_id'),
      blogCategoryId: optionalText(formData, 'blog_category_id'),
    });

    if (parsed.contentType === 'product' && !parsed.targetProductId && !parsed.softwareCategoryId) {
      throw new Error('Choisissez une catégorie pour le nouveau produit ou sélectionnez une fiche existante.');
    }

    const { supabase, provider } = await runtimeProvider(parsed.providerKey);
    const { data: settingsRow } = await supabase
      .from('ai_settings')
      .select('payload')
      .eq('id', 'main')
      .maybeSingle();

    const settings = (settingsRow?.payload || {}) as Record<string, string>;
    const brand: CopilotBrandSettings = {
      brandName: settings.brandName || 'GamaDigit',
      brandVoice: settings.brandVoice || 'Clair, professionnel, rassurant et accessible.',
      businessContext: settings.businessContext || 'GamaDigit propose des solutions numériques.',
      editorialRules: settings.editorialRules || 'Ne jamais inventer une donnée commerciale.',
    };

    const prompts = buildCopilotPrompts({
      contentType: parsed.contentType,
      language: parsed.language,
      tone: parsed.tone,
      brief: parsed.brief,
      brand,
    });

    const raw = await callAiProvider({ provider, ...prompts });
    const result = parseCopilotResult(raw);
    const { data: userData } = await supabase.auth.getUser();
    const { data: generation, error: insertError } = await supabase
      .from('ai_generations')
      .insert({
        content_type: parsed.contentType,
        language: parsed.language,
        tone: parsed.tone,
        provider_key: provider.provider_key,
        model: provider.model,
        brief: parsed.brief,
        result,
        created_by: userData.user?.id || null,
      })
      .select('id')
      .single();

    if (insertError) throw new Error(insertError.message);
    revalidatePath('/admin/copilote');

    return {
      status: 'success',
      message: 'Le contenu a été généré et enregistré dans l’historique.',
      generationId: generation.id,
      provider: provider.display_name,
      model: provider.model,
      result,
      formatted: formatCopilotResult(result),
      draftContext: {
        contentType: parsed.contentType,
        targetProductId: parsed.targetProductId,
        softwareCategoryId: parsed.softwareCategoryId,
        blogCategoryId: parsed.blogCategoryId,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'La génération a échoué.',
    };
  }
}

export type CopilotDraftActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  targetId?: string;
  editUrl?: string;
  previewUrl?: string;
};

async function uniqueSlug(supabase: Awaited<ReturnType<typeof adminClient>>, table: 'services' | 'blog_posts', title: string) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const { data } = await supabase.from(table).select('id').eq('slug', candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createCopilotDraftAction(
  _previousState: CopilotDraftActionState,
  formData: FormData,
): Promise<CopilotDraftActionState> {
  try {
    const supabase = await adminClient();
    const generationId = z.string().uuid().parse(text(formData, 'generation_id'));
    const targetProductId = optionalUuidSchema.parse(optionalText(formData, 'target_product_id'));
    const softwareCategoryId = optionalUuidSchema.parse(optionalText(formData, 'software_category_id'));
    const blogCategoryId = optionalUuidSchema.parse(optionalText(formData, 'blog_category_id'));

    const { data: generation, error: generationError } = await supabase
      .from('ai_generations')
      .select('id, content_type, result')
      .eq('id', generationId)
      .single();

    if (generationError || !generation) throw new Error('La génération est introuvable.');
    if (!generation.result || typeof generation.result !== 'object' || Array.isArray(generation.result)) {
      throw new Error('Le résultat généré n’est pas exploitable.');
    }

    const result = generation.result as Record<string, unknown>;

    if (generation.content_type === 'product') {
      const generatedTitle = resultString(result, 'title');
      const generatedExcerpt = resultString(result, 'short_description');
      const generatedDescription = resultString(result, 'long_description');
      const benefits = resultStrings(result, 'benefits');
      const targetAudience = resultStrings(result, 'target_audience');
      const keyPoints = resultStrings(result, 'key_points');
      const whatsappMessage = resultString(result, 'whatsapp_message');
      const seoTitle = resultString(result, 'seo_title');
      const seoDescription = resultString(result, 'seo_description');
      const facebookPost = resultString(result, 'facebook_post');

      if (targetProductId) {
        const { data: existing, error: existingError } = await supabase
          .from('services')
          .select('id, slug, excerpt, description, features, target_audience, key_points, whatsapp_message, seo_title, seo_description, social_content')
          .eq('id', targetProductId)
          .single();
        if (existingError || !existing) throw new Error('La fiche produit sélectionnée est introuvable.');

        const currentSocial = existing.social_content && typeof existing.social_content === 'object'
          ? existing.social_content as Record<string, unknown>
          : {};
        const { error: updateError } = await supabase
          .from('services')
          .update({
            excerpt: generatedExcerpt || existing.excerpt,
            description: generatedDescription || existing.description,
            features: benefits.length ? benefits : existing.features,
            target_audience: targetAudience.length ? targetAudience : existing.target_audience,
            key_points: keyPoints.length ? keyPoints : existing.key_points,
            whatsapp_message: whatsappMessage || existing.whatsapp_message,
            seo_title: seoTitle || existing.seo_title,
            seo_description: seoDescription || existing.seo_description,
            social_content: facebookPost ? { ...currentSocial, facebook_post: facebookPost } : currentSocial,
            source_generation_id: generationId,
          })
          .eq('id', targetProductId);
        if (updateError) throw new Error(updateError.message);

        const previewUrl = `/admin/apercu/logiciel/${targetProductId}`;
        await supabase.from('ai_generations').update({
          target_type: 'service',
          target_id: targetProductId,
          target_url: previewUrl,
        }).eq('id', generationId);

        revalidatePath('/admin/logiciels');
        revalidatePath(previewUrl);
        revalidatePath(`/logiciels/${existing.slug}`);
        revalidatePath('/logiciels');

        return {
          status: 'success',
          message: 'La fiche existante a été enrichie. Son prix, son image et son statut ont été conservés.',
          targetId: targetProductId,
          editUrl: `/admin/logiciels#produit-${targetProductId}`,
          previewUrl,
        };
      }

      if (!softwareCategoryId) throw new Error('Choisissez la catégorie du nouveau produit.');
      if (!generatedTitle || !generatedExcerpt || !generatedDescription) {
        throw new Error('Le résultat ne contient pas les informations minimales d’une fiche produit.');
      }

      const { data: family, error: familyError } = await supabase
        .from('service_families')
        .select('id')
        .eq('slug', 'logiciels-abonnements')
        .single();
      if (familyError || !family) throw new Error('La famille Logiciels et abonnements est introuvable.');

      const slug = await uniqueSlug(supabase, 'services', generatedTitle);
      const { data: product, error: insertError } = await supabase
        .from('services')
        .insert({
          family_id: family.id,
          software_category_id: softwareCategoryId,
          name: generatedTitle,
          slug,
          excerpt: generatedExcerpt,
          description: generatedDescription,
          price_label: null,
          delivery_label: null,
          features: benefits,
          target_audience: targetAudience,
          key_points: keyPoints,
          media: [],
          whatsapp_message: whatsappMessage || null,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
          social_content: facebookPost ? { facebook_post: facebookPost } : {},
          source_generation_id: generationId,
          status: 'draft',
          is_featured: false,
          sort_order: 0,
          published_at: null,
        })
        .select('id')
        .single();
      if (insertError || !product) throw new Error(insertError?.message || 'Impossible de créer le brouillon.');

      const previewUrl = `/admin/apercu/logiciel/${product.id}`;
      await supabase.from('ai_generations').update({
        target_type: 'service',
        target_id: product.id,
        target_url: previewUrl,
      }).eq('id', generationId);

      revalidatePath('/admin/logiciels');
      revalidatePath('/admin/copilote');
      return {
        status: 'success',
        message: 'La fiche produit a été créée en brouillon. Ajoutez le prix et l’image avant publication.',
        targetId: product.id,
        editUrl: `/admin/logiciels#produit-${product.id}`,
        previewUrl,
      };
    }

    if (generation.content_type === 'article') {
      const title = resultString(result, 'title');
      const excerpt = resultString(result, 'excerpt');
      const content = articleResultToBlocks(result);
      if (!title || !excerpt || !content.length) {
        throw new Error('Le résultat ne contient pas les informations minimales d’un article.');
      }

      const slug = await uniqueSlug(supabase, 'blog_posts', title);
      const wordCount = JSON.stringify(content).split(/\s+/).length;
      const readTime = `${Math.max(2, Math.ceil(wordCount / 220))} min`;
      const facebookPost = resultString(result, 'facebook_post');
      const { data: article, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          category_id: blogCategoryId || null,
          title,
          slug,
          excerpt,
          content,
          author_name: 'Équipe GamaDigit',
          read_time: readTime,
          seo_title: resultString(result, 'seo_title') || null,
          seo_description: resultString(result, 'seo_description') || null,
          social_content: facebookPost ? { facebook_post: facebookPost } : {},
          source_generation_id: generationId,
          status: 'draft',
          published_at: null,
        })
        .select('id')
        .single();
      if (insertError || !article) throw new Error(insertError?.message || 'Impossible de créer le brouillon.');

      const previewUrl = `/admin/apercu/article/${article.id}`;
      await supabase.from('ai_generations').update({
        target_type: 'blog_post',
        target_id: article.id,
        target_url: previewUrl,
      }).eq('id', generationId);

      revalidatePath('/admin/articles');
      revalidatePath('/admin/copilote');
      return {
        status: 'success',
        message: 'L’article a été créé en brouillon avec sa structure, son SEO et sa publication Facebook.',
        targetId: article.id,
        editUrl: '/admin/articles',
        previewUrl,
      };
    }

    throw new Error('Les publications sociales restent disponibles dans l’historique pour être copiées.');
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'La création du brouillon a échoué.',
    };
  }
}
