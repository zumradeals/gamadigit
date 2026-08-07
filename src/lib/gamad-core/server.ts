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

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Configuration Core manquante: ${name}`);
  }

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

async function coreFetch(
  url: string,
  init: RequestInit,
): Promise<Response> {
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

export async function handshakeWithGamadCore(): Promise<CoreHandshakeResult> {
  const config = getGamadCoreConfig();
  const correlationId = crypto.randomUUID();

  let sessionToken: string | undefined;
  let assurance: string | undefined;

  try {
    const sessionResponse = await coreFetch(`${config.baseUrl}/sessions`, {
      method: 'POST',
      headers: {
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify({
        entite: config.productRef,
        secret: config.connectSecret,
      }),
    });

    if (!sessionResponse.ok) {
      return {
        ok: false,
        coreReachable: true,
        authenticated: false,
        sessionClosed: false,
        productRef: config.productRef,
        authnRef: config.authnRef,
        error: `CORE_SESSION_${sessionResponse.status}`,
      };
    }

    const session = (await sessionResponse.json()) as {
      jeton?: string;
      entite?: string;
      assurance?: string;
    };

    if (!session.jeton || session.entite !== config.productRef) {
      return {
        ok: false,
        coreReachable: true,
        authenticated: false,
        sessionClosed: false,
        productRef: config.productRef,
        authnRef: config.authnRef,
        error: 'CORE_SESSION_REPONSE_INVALIDE',
      };
    }

    sessionToken = session.jeton;
    assurance = session.assurance;

    const closeResponse = await coreFetch(`${config.baseUrl}/sessions/current`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'X-Correlation-ID': correlationId,
      },
    });

    return {
      ok: closeResponse.ok,
      coreReachable: true,
      authenticated: true,
      sessionClosed: closeResponse.ok,
      productRef: config.productRef,
      authnRef: config.authnRef,
      assurance,
      error: closeResponse.ok ? undefined : `CORE_SESSION_CLOSE_${closeResponse.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      coreReachable: false,
      authenticated: Boolean(sessionToken),
      sessionClosed: false,
      productRef: config.productRef,
      authnRef: config.authnRef,
      assurance,
      error: error instanceof Error && error.name === 'AbortError'
        ? 'CORE_TIMEOUT'
        : 'CORE_UNREACHABLE',
    };
  }
}
