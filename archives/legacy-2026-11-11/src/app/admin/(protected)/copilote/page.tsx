import {
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  KeyRound,
  PlugZap,
  Save,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  removeAiProviderKeyAction,
  saveAiProviderAction,
  saveAiSettingsAction,
  testAiProviderAction,
} from '@/app/admin/(protected)/copilote/actions';
import {
  CopilotStudio,
  type CopilotProviderOption,
  type CopilotSelectOption,
} from '@/components/admin/copilot-studio';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

type ProviderRow = {
  provider_key: string;
  display_name: string;
  api_style: string;
  base_url: string;
  model: string;
  enabled: boolean;
  priority: number;
  secret_id: string | null;
  last_tested_at: string | null;
  last_test_status: 'success' | 'error' | null;
  last_test_message: string | null;
};

type GenerationRow = {
  id: string;
  content_type: string;
  provider_key: string;
  model: string;
  language: string;
  brief: string;
  created_at: string;
  target_url: string | null;
};

function formatDate(value: string | null) {
  if (!value) return 'Jamais testé';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default async function AdminCopilotPage() {
  const supabase = await createSupabaseServerClient();
  const [providersQuery, settingsQuery, generationsQuery, softwareCategoriesQuery, productsQuery, blogCategoriesQuery] = supabase
    ? await Promise.all([
        supabase.from('ai_providers').select('*').order('priority'),
        supabase.from('ai_settings').select('payload').eq('id', 'main').maybeSingle(),
        supabase.from('ai_generations').select('id, content_type, provider_key, model, language, brief, created_at, target_url').order('created_at', { ascending: false }).limit(8),
        supabase.from('software_categories').select('id, name').order('sort_order'),
        supabase.from('services').select('id, name, price_label, status, service_families!inner(slug)').eq('service_families.slug', 'logiciels-abonnements').order('name'),
        supabase.from('blog_categories').select('id, name').order('sort_order'),
      ])
    : [{ data: [] }, { data: null }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const providers = (providersQuery.data || []) as ProviderRow[];
  const settings = (settingsQuery.data?.payload || {}) as Record<string, string>;
  const generations = (generationsQuery.data || []) as GenerationRow[];
  const providerOptions: CopilotProviderOption[] = providers.map((provider) => ({
    provider_key: provider.provider_key,
    display_name: provider.display_name,
    model: provider.model,
    enabled: provider.enabled,
    has_secret: Boolean(provider.secret_id),
  }));
  const softwareCategories: CopilotSelectOption[] = (softwareCategoriesQuery.data || []).map((row) => ({ id: row.id, name: row.name }));
  const softwareProducts: CopilotSelectOption[] = (productsQuery.data || []).map((row) => ({
    id: row.id,
    name: row.name,
    detail: `${row.price_label || 'Tarif non défini'} · ${row.status}`,
  }));
  const blogCategories: CopilotSelectOption[] = (blogCategoriesQuery.data || []).map((row) => ({ id: row.id, name: row.name }));
  const configuredCount = providers.filter((provider) => provider.secret_id).length;
  const activeCount = providers.filter((provider) => provider.enabled && provider.secret_id).length;

  return (
    <div className="space-y-9">
      <header>
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-ink p-3 text-cyan"><Bot className="h-6 w-6" /></span>
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Intelligence commerciale</p><h1 className="mt-1 text-3xl font-black text-ink">GamaDigit Copilote</h1></div>
        </div>
        <p className="mt-4 max-w-4xl leading-7 text-slate-600">Créez vos contenus puis transformez-les en brouillons du catalogue ou du blog, sans copier-coller et sans modifier automatiquement les prix.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">Moteurs configurés</p><p className="mt-2 text-3xl font-black text-ink">{configuredCount} / {providers.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">Moteurs actifs</p><p className="mt-2 text-3xl font-black text-mint">{activeCount}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">Historique récent</p><p className="mt-2 text-3xl font-black text-ocean">{generations.length}</p></div>
        </div>
      </header>

      <CopilotStudio
        providers={providerOptions}
        defaultLanguage={settings.defaultLanguage || 'fr'}
        defaultTone={settings.defaultTone || 'commercial'}
        softwareCategories={softwareCategories}
        softwareProducts={softwareProducts}
        blogCategories={blogCategories}
      />

      <section>
        <div className="flex items-start gap-3"><KeyRound className="mt-1 h-6 w-6 text-ocean" /><div><h2 className="text-2xl font-black text-ink">Moteurs IA et clés API</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">Ajoutez une clé, choisissez le modèle puis activez le moteur. La clé est chiffrée dans Supabase Vault et n’est jamais réaffichée dans le navigateur.</p></div></div>
        <div className="mt-7 grid gap-6 xl:grid-cols-3">
          {providers.map((provider) => {
            const hasSecret = Boolean(provider.secret_id);
            return (
              <article key={provider.provider_key} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{provider.provider_key}</p><h3 className="mt-2 text-xl font-black text-ink">{provider.display_name}</h3></div><span className={`rounded-full px-3 py-1.5 text-xs font-black ${provider.enabled && hasSecret ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{provider.enabled && hasSecret ? 'Actif' : 'Inactif'}</span></div>
                <div className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm ${hasSecret ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{hasSecret ? <ShieldCheck className="h-5 w-5 shrink-0" /> : <KeyRound className="h-5 w-5 shrink-0" />}<p>{hasSecret ? 'Clé API enregistrée et chiffrée.' : 'Aucune clé API enregistrée.'}</p></div>
                <form action={saveAiProviderAction} className="mt-6 space-y-4">
                  <input type="hidden" name="provider_key" value={provider.provider_key} /><input type="hidden" name="api_style" value={provider.api_style} /><input type="hidden" name="priority" value={provider.priority} />
                  <div><label className={labelClass}>Nom affiché</label><input name="display_name" defaultValue={provider.display_name} className={inputClass} required /></div>
                  <div><label className={labelClass}>Adresse API</label><input name="base_url" type="url" defaultValue={provider.base_url} className={inputClass} required /></div>
                  <div><label className={labelClass}>Modèle utilisé</label><input name="model" defaultValue={provider.model} className={inputClass} required /><p className="mt-1.5 text-xs leading-5 text-slate-500">Modifiable lorsque le fournisseur publie un nouveau modèle.</p></div>
                  <div><label className={labelClass}>{hasSecret ? 'Remplacer la clé API' : 'Clé API'}</label><input name="api_key" type="password" autoComplete="new-password" placeholder={hasSecret ? 'Laisser vide pour conserver la clé actuelle' : 'Collez la clé API ici'} className={inputClass} /></div>
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"><input name="enabled" type="checkbox" defaultChecked={provider.enabled} className="h-4 w-4 rounded border-slate-300" />Activer ce moteur dans le Studio</label>
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 font-black text-white"><Save className="h-4 w-4" /> Enregistrer</button>
                </form>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <form action={testAiProviderAction}><input type="hidden" name="provider_key" value={provider.provider_key} /><button disabled={!hasSecret} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-40"><PlugZap className="h-4 w-4" /> Tester</button></form>
                  <form action={removeAiProviderKeyAction}><input type="hidden" name="provider_key" value={provider.provider_key} /><button disabled={!hasSecret} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-sm font-black text-red-600 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /> Retirer</button></form>
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4"><p className="flex items-center gap-2 text-xs font-bold text-slate-500"><Clock3 className="h-4 w-4" /> {formatDate(provider.last_tested_at)}</p>{provider.last_test_status ? <p className={`mt-2 flex items-start gap-2 text-xs font-semibold leading-5 ${provider.last_test_status === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>{provider.last_test_status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}{provider.last_test_message || (provider.last_test_status === 'success' ? 'Connexion réussie.' : 'Connexion échouée.')}</p> : null}</div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black text-ink">Identité éditoriale du Copilote</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">Ces consignes sont envoyées à chaque moteur pour garder des contenus cohérents avec GamaDigit.</p>
        <form action={saveAiSettingsAction} className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-3"><div><label className={labelClass}>Nom de la marque</label><input name="brandName" defaultValue={settings.brandName || 'GamaDigit'} className={inputClass} required /></div><div><label className={labelClass}>Langue par défaut</label><select name="defaultLanguage" defaultValue={settings.defaultLanguage || 'fr'} className={inputClass}><option value="fr">Français</option><option value="en">Anglais</option><option value="ar">Arabe</option></select></div><div><label className={labelClass}>Ton par défaut</label><select name="defaultTone" defaultValue={settings.defaultTone || 'commercial'} className={inputClass}><option value="commercial">Commercial</option><option value="pedagogique">Pédagogique</option><option value="professionnel">Professionnel</option><option value="direct">Direct</option></select></div></div>
          <div><label className={labelClass}>Voix de marque</label><textarea name="brandVoice" rows={3} defaultValue={settings.brandVoice || 'Clair, professionnel, rassurant, accessible et orienté vers WhatsApp.'} className={`${inputClass} resize-y leading-7`} required /></div>
          <div><label className={labelClass}>Contexte commercial</label><textarea name="businessContext" rows={4} defaultValue={settings.businessContext || 'GamaDigit vend des logiciels et abonnements, propose des formations professionnelles et réalise des services numériques.'} className={`${inputClass} resize-y leading-7`} required /></div>
          <div><label className={labelClass}>Règles éditoriales et commerciales</label><textarea name="editorialRules" rows={5} defaultValue={settings.editorialRules || 'Ne jamais inventer un prix, une durée, une disponibilité, une certification, un nombre d’appareils ou une condition commerciale. Utiliser uniquement les faits fournis dans le brief.'} className={`${inputClass} resize-y leading-7`} required /></div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 font-black text-white"><Save className="h-4 w-4" /> Enregistrer l’identité IA</button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black text-ink">Historique récent</h2><p className="mt-2 text-slate-600">Chaque génération reste disponible et indique lorsqu’elle a déjà produit un brouillon CMS.</p>
        {generations.length ? (
          <div className="mt-6 divide-y divide-slate-100">
            {generations.map((generation) => (
              <article key={generation.id} className="grid gap-3 py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-center">
                <div><p className="text-xs font-black uppercase tracking-[0.13em] text-ocean">{generation.content_type}</p><p className="mt-1 text-xs text-slate-400">{generation.language.toUpperCase()}</p></div>
                <div><p className="line-clamp-2 text-sm font-semibold leading-6 text-ink">{generation.brief}</p><p className="mt-1 text-xs text-slate-400">{generation.provider_key} · {generation.model}</p></div>
                <div className="text-right"><p className="text-xs font-semibold text-slate-400">{formatDate(generation.created_at)}</p>{generation.target_url ? <a href={generation.target_url} className="mt-2 inline-flex items-center gap-1 text-xs font-black text-ocean">Voir le brouillon <ExternalLink className="h-3 w-3" /></a> : null}</div>
              </article>
            ))}
          </div>
        ) : <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Aucun contenu généré pour le moment.</div>}
      </section>
    </div>
  );
}
