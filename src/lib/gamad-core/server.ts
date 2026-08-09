import 'server-only';

const CORE_TIMEOUT_MS = 8_000;

export type GamadCoreConfig = {
  baseUrl: string;
  productRef: string;
  authnRef: string;
  connectSecret: string;
};

export type CoreHandshakeResult = {
  ok: boolean;
  coreReachable: boolean;
  authenticated: boolean;
  sessionClosed: boolean;
  productRef: string;
  authnRef: string;
  assurance?: string;
  error?: string;
};

type CoreProductEnvironment = {
  environnement?: string;
  actif?: boolean;
  logout_url?: string | null;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Configuration Core manquante: ${name}`);
  return value;
}

export function getGamadCoreConfig(): GamadCoreConfig {
  return {
    baseUrl: required('GAMAD_CORE_BASE_URL').replace(/\/$/, ''),
    productRef: required('GAMAD_CORE_PRODUCT_REF'),
    authnRef: required('GAMAD_CORE_AUTHN_REF'),
    connectSecret: required('GAMAD_CORE_CONNECT_SECRET'),
  };
}

export async function coreFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CORE_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function openProductSession() {
  const config = getGamadCoreConfig();
  const correlationId = crypto.randomUUID();
  const response = await coreFetch(`${config.baseUrl}/sessions`, {
    method: 'POST',
    headers: { 'X-Correlation-ID': correlationId },
    body: JSON.stringify({ entite: config.productRef, secret: config.connectSecret }),
  });
  const body = (await response.json().catch(() => ({}))) as { jeton?: string; entite?: string; assurance?: string; erreur?: string };
  if (!response.ok || !body.jeton || body.entite !== config.productRef) {
    throw new Error(body.erreur || `CORE_PRODUCT_SESSION_${response.status}`);
  }
  return { config, token: body.jeton, correlationId, assurance: body.assurance };
}

async function closeProductSession(baseUrl: string, token: string, correlationId: string) {
  await coreFetch(`${baseUrl}/sessions/current`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'X-Correlation-ID': correlationId },
  }).catch(() => undefined);
}

/**
 * Exécute une requête Core avec l'identité produit du portail.
 * La session produit est courte et révoquée dans `finally` : elle ne franchit
 * jamais la frontière serveur -> navigateur.
 */
export async function coreProductRequest(path: string, init: RequestInit): Promise<Response> {
  const session = await openProductSession();
  try {
    return await coreFetch(`${session.config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${session.token}`,
        'X-Correlation-ID': session.correlationId,
      },
    });
  } finally {
    await closeProductSession(session.config.baseUrl, session.token, session.correlationId);
  }
}

function frontChannelLogoutUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Lit le canal de déconnexion front-channel depuis le registre gouverné des
 * produits Core (CAP-CORE-011). Une absence de valeur ou une indisponibilité
 * du registre ne doit jamais empêcher la fermeture de la session centrale.
 */
export async function readProductionLogoutUrl(productRef: string): Promise<string | null> {
  try {
    const response = await coreProductRequest(
      `/produits/${encodeURIComponent(productRef)}/environnements`,
      { method: 'GET' },
    );
    if (!response.ok) return null;

    const body = (await response.json().catch(() => ({}))) as {
      environnements?: CoreProductEnvironment[];
    };
    const environments = Array.isArray(body.environnements) ? body.environnements : [];
    const production = environments.find(
      (environment) => environment.environnement === 'PRODUCTION' && environment.actif === true,
    );

    return frontChannelLogoutUrl(production?.logout_url);
  } catch {
    return null;
  }
}

export async function handshakeWithGamadCore(): Promise<CoreHandshakeResult> {
  const config = getGamadCoreConfig();
  const correlationId = crypto.randomUUID();
  let sessionToken: string | undefined;
  let assurance: string | undefined;

  try {
    const sessionResponse = await coreFetch(`${config.baseUrl}/sessions`, {
      method: 'POST',
      headers: { 'X-Correlation-ID': correlationId },
      body: JSON.stringify({ entite: config.productRef, secret: config.connectSecret }),
    });

    if (!sessionResponse.ok) {
      return { ok: false, coreReachable: true, authenticated: false, sessionClosed: false, productRef: config.productRef, authnRef: config.authnRef, error: `CORE_SESSION_${sessionResponse.status}` };
    }

    const session = (await sessionResponse.json()) as { jeton?: string; entite?: string; assurance?: string };
    if (!session.jeton || session.entite !== config.productRef) {
      return { ok: false, coreReachable: true, authenticated: false, sessionClosed: false, productRef: config.productRef, authnRef: config.authnRef, error: 'CORE_SESSION_REPONSE_INVALIDE' };
    }

    sessionToken = session.jeton;
    assurance = session.assurance;
    const closeResponse = await coreFetch(`${config.baseUrl}/sessions/current`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionToken}`, 'X-Correlation-ID': correlationId },
    });

    return { ok: closeResponse.ok, coreReachable: true, authenticated: true, sessionClosed: closeResponse.ok, productRef: config.productRef, authnRef: config.authnRef, assurance, error: closeResponse.ok ? undefined : `CORE_SESSION_CLOSE_${closeResponse.status}` };
  } catch (error) {
    return { ok: false, coreReachable: false, authenticated: Boolean(sessionToken), sessionClosed: false, productRef: config.productRef, authnRef: config.authnRef, assurance, error: error instanceof Error && error.name === 'AbortError' ? 'CORE_TIMEOUT' : 'CORE_UNREACHABLE' };
  }
}
