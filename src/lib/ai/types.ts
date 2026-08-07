export type AiProviderKey = 'deepseek' | 'openai' | 'anthropic';

export type AiApiStyle =
  | 'openai_chat'
  | 'openai_responses'
  | 'anthropic_messages';

export type AiRuntimeProvider = {
  provider_key: AiProviderKey;
  display_name: string;
  api_style: AiApiStyle;
  base_url: string;
  model: string;
  api_key: string;
};

export type CopilotContentType = 'product' | 'article' | 'social';
export type CopilotLanguage = 'fr' | 'en' | 'ar';
export type CopilotTone = 'commercial' | 'pedagogique' | 'professionnel' | 'direct';

export type CopilotBrandSettings = {
  brandName: string;
  brandVoice: string;
  businessContext: string;
  editorialRules: string;
};

export type CopilotGenerationResult = Record<string, unknown>;
