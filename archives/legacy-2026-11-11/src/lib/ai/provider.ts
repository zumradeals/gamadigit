import type { AiRuntimeProvider } from '@/lib/ai/types';

const REQUEST_TIMEOUT_MS = 90_000;

function endpoint(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function readError(response: Response) {
  const fallback = `Erreur ${response.status} ${response.statusText}`;

  try {
    const payload = (await response.json()) as {
      error?: { message?: string } | string;
      message?: string;
    };

    if (typeof payload.error === 'string') return payload.error.slice(0, 500);
    if (payload.error?.message) return payload.error.message.slice(0, 500);
    if (payload.message) return payload.message.slice(0, 500);
    return fallback;
  } catch {
    return fallback;
  }
}

async function requestJson(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    return (await response.json()) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Le fournisseur IA a dépassé le délai de réponse autorisé.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function extractOpenAiResponseText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  const texts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const content = Array.isArray((item as { content?: unknown[] }).content)
      ? (item as { content: unknown[] }).content
      : [];

    for (const part of content) {
      if (!part || typeof part !== 'object') continue;
      const text = (part as { text?: unknown }).text;
      if (typeof text === 'string') texts.push(text);
    }
  }

  return texts.join('\n').trim();
}

export async function callAiProvider(input: {
  provider: AiRuntimeProvider;
  systemPrompt: string;
  userPrompt: string;
  maxOutputTokens?: number;
}) {
  const { provider, systemPrompt, userPrompt, maxOutputTokens = 5000 } = input;

  if (provider.api_style === 'openai_chat') {
    const payload = await requestJson(endpoint(provider.base_url, '/chat/completions'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: maxOutputTokens,
      }),
    });

    const choices = Array.isArray(payload.choices) ? payload.choices : [];
    const first = choices[0] as { message?: { content?: unknown } } | undefined;
    const content = first?.message?.content;

    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('Le fournisseur IA n’a retourné aucun texte exploitable.');
    }

    return content.trim();
  }

  if (provider.api_style === 'openai_responses') {
    const payload = await requestJson(endpoint(provider.base_url, '/responses'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.model,
        instructions: systemPrompt,
        input: userPrompt,
        max_output_tokens: maxOutputTokens,
      }),
    });

    const text = extractOpenAiResponseText(payload);
    if (!text) throw new Error('OpenAI n’a retourné aucun texte exploitable.');
    return text;
  }

  const payload = await requestJson(endpoint(provider.base_url, '/messages'), {
    method: 'POST',
    headers: {
      'x-api-key': provider.api_key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.model,
      system: systemPrompt,
      max_tokens: maxOutputTokens,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  const content = Array.isArray(payload.content) ? payload.content : [];
  const text = content
    .map((part) => {
      if (!part || typeof part !== 'object') return '';
      const value = (part as { text?: unknown }).text;
      return typeof value === 'string' ? value : '';
    })
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!text) throw new Error('Claude n’a retourné aucun texte exploitable.');
  return text;
}
