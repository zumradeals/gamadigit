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

const providerKeySchema = z.enum(['deepseek', 'openai', 'anthropic']);
const apiStyleSchema = z.enum(['openai_chat', 'openai_responses', 'anthropic_messages']);

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

export type CopilotActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  generationId?: string;
  provider?: string;
  model?: string;
  result?: CopilotGenerationResult;
  formatted?: string;
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
    }).parse({
      providerKey: text(formData, 'provider_key'),
      contentType: text(formData, 'content_type'),
      language: text(formData, 'language'),
      tone: text(formData, 'tone'),
      brief: text(formData, 'brief'),
    });

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
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'La génération a échoué.',
    };
  }
}
