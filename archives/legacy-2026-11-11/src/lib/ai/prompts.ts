import type {
  CopilotBrandSettings,
  CopilotContentType,
  CopilotLanguage,
  CopilotTone,
} from '@/lib/ai/types';

const languageLabels: Record<CopilotLanguage, string> = {
  fr: 'français',
  en: 'anglais',
  ar: 'arabe',
};

const toneLabels: Record<CopilotTone, string> = {
  commercial: 'commercial, clair et convaincant',
  pedagogique: 'pédagogique, simple et rassurant',
  professionnel: 'professionnel, structuré et crédible',
  direct: 'direct, concis et orienté vers l’action',
};

const outputSchemas: Record<CopilotContentType, string> = {
  product: `{
  "title": "Nom commercial clair",
  "short_description": "Résumé de 1 à 2 phrases",
  "long_description": "Description commerciale complète",
  "target_audience": ["Public 1", "Public 2"],
  "benefits": ["Avantage 1", "Avantage 2", "Avantage 3"],
  "key_points": ["Information factuelle 1", "Information factuelle 2"],
  "seo_title": "Titre SEO",
  "seo_description": "Méta-description SEO",
  "whatsapp_message": "Message prérempli pour demander ou commander",
  "facebook_post": "Publication Facebook prête à utiliser"
}`,
  article: `{
  "title": "Titre de l’article",
  "excerpt": "Résumé introductif",
  "introduction": "Introduction",
  "sections": [
    {
      "heading": "Titre de section",
      "paragraphs": ["Paragraphe 1", "Paragraphe 2"]
    }
  ],
  "conclusion": "Conclusion avec appel à l’action",
  "seo_title": "Titre SEO",
  "seo_description": "Méta-description SEO",
  "facebook_post": "Publication Facebook pour promouvoir l’article"
}`,
  social: `{
  "facebook_post": "Publication Facebook complète",
  "short_caption": "Légende courte",
  "whatsapp_status": "Texte court pour un statut WhatsApp",
  "ad_headlines": ["Titre publicitaire 1", "Titre publicitaire 2", "Titre publicitaire 3"],
  "hashtags": ["#GamaDigit", "#Numerique"]
}`,
};

export function buildCopilotPrompts(input: {
  contentType: CopilotContentType;
  language: CopilotLanguage;
  tone: CopilotTone;
  brief: string;
  brand: CopilotBrandSettings;
}) {
  const { contentType, language, tone, brief, brand } = input;

  const systemPrompt = `Tu es GamaDigit Copilote, l’assistant éditorial et commercial interne de ${brand.brandName}.

Contexte de l’entreprise :
${brand.businessContext}

Voix de marque :
${brand.brandVoice}

Règles impératives :
${brand.editorialRules}
- N’invente jamais une information absente du brief.
- Lorsqu’une donnée commerciale manque, écris "À confirmer sur WhatsApp" ou omets-la.
- Oriente naturellement le lecteur vers WhatsApp sans être agressif.
- Utilise un langage accessible, sans jargon inutile.
- Réponds uniquement avec un objet JSON valide, sans balise Markdown ni commentaire autour du JSON.`;

  const userPrompt = `Crée un contenu de type "${contentType}" en ${languageLabels[language]}, avec un ton ${toneLabels[tone]}.

Brief validé :
${brief}

Respecte exactement cette structure JSON :
${outputSchemas[contentType]}`;

  return { systemPrompt, userPrompt };
}
