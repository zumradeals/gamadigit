import type { CopilotGenerationResult } from '@/lib/ai/types';

function stripCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

export function parseCopilotResult(raw: string): CopilotGenerationResult {
  const cleaned = stripCodeFence(raw);

  try {
    const parsed = JSON.parse(cleaned) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as CopilotGenerationResult;
    }
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start >= 0 && end > start) {
      try {
        const parsed = JSON.parse(cleaned.slice(start, end + 1)) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as CopilotGenerationResult;
        }
      } catch {
        // Le texte brut est conservé ci-dessous.
      }
    }
  }

  return { content: cleaned };
}

function humanizeKey(key: string) {
  const labels: Record<string, string> = {
    title: 'Titre',
    short_description: 'Description courte',
    long_description: 'Description complète',
    target_audience: 'Public concerné',
    benefits: 'Avantages',
    key_points: 'Points essentiels',
    seo_title: 'Titre SEO',
    seo_description: 'Description SEO',
    whatsapp_message: 'Message WhatsApp',
    facebook_post: 'Publication Facebook',
    excerpt: 'Résumé',
    introduction: 'Introduction',
    sections: 'Sections',
    heading: 'Intertitre',
    paragraphs: 'Paragraphes',
    conclusion: 'Conclusion',
    short_caption: 'Légende courte',
    whatsapp_status: 'Statut WhatsApp',
    ad_headlines: 'Titres publicitaires',
    hashtags: 'Hashtags',
    content: 'Contenu',
  };

  return labels[key] || key.replace(/_/g, ' ').replace(/^./, (value) => value.toUpperCase());
}

function formatValue(value: unknown, depth = 0): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (item && typeof item === 'object') {
          return `${index + 1}.\n${formatValue(item, depth + 1)}`;
        }
        return `• ${String(item)}`;
      })
      .join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, child]) => `${'#'.repeat(Math.min(depth + 3, 6))} ${humanizeKey(key)}\n${formatValue(child, depth + 1)}`)
      .join('\n\n');
  }

  return '';
}

export function formatCopilotResult(result: CopilotGenerationResult) {
  return Object.entries(result)
    .map(([key, value]) => `## ${humanizeKey(key)}\n${formatValue(value, 0)}`)
    .join('\n\n');
}
