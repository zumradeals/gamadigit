import crypto from 'node:crypto';

const COOKIE_NAME = 'dgafrique_gamad_session';

type CoreSession = {
  jeton?: string;
  entite?: string;
  assurance?: string;
  expire_le?: string;
  erreur?: string;
  message?: string;
};

export type PortalAccountSession = {
  token: string;
  entity: string;
  assurance: string | null;
  expiresAt: string;
};

function coreBaseUrl() {
  const value = process.env.GAMAD_CORE_BASE_URL?.replace(/\/$/, '');
  if (!value) throw new Error('GAMAD_CORE_BASE_URL manquant');
  return value;
}

function signingKey() {
  const secret = process.env.GAMAD_CORE_CONNECT_SECRET;
  if (!secret) throw new Error('GAMAD_CORE_CONNECT_SECRET manquant');
  return crypto.createHmac('sha256', secret).update('dgafrique-portal-account-cookie-v1').digest();
}

function signature(payload: string) {
  return crypto.createHmac('sha256', signingKey()).update(payload).digest('base64url');
}

export function serializePortalSession(session: PortalAccountSession) {
  const payload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function parsePortalSession(value?: string | null): PortalAccountSession | null {
  if (!value) return null;
  const [payload, suppliedSignature] = value.split('.');
  if (!payload || !suppliedSignature) return null;

  const expected = signature(payload);
  const left = Buffer.from(suppliedSignature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as PortalAccountSession;
    if (!parsed.token || !parsed.entity || !parsed.expiresAt) return null;
    if (Date.parse(parsed.expiresAt) <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function openUserSession(entity: string, secret: string): Promise<PortalAccountSession> {
  const response = await fetch(`${coreBaseUrl()}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ entite: entity, secret }),
    cache: 'no-store',
  });

  const body = (await response.json().catch(() => ({}))) as CoreSession;
  if (!response.ok || !body.jeton || !body.entite || !body.expire_le) {
    throw new Error(response.status === 401 ? 'AUTHENTIFICATION_REFUSEE' : body.erreur || 'CORE_INDISPONIBLE');
  }

  return {
    token: body.jeton,
    entity: body.entite,
    assurance: body.assurance ?? null,
    expiresAt: body.expire_le,
  };
}

export async function readCanonicalIdentity(session: PortalAccountSession) {
  const response = await fetch(`${coreBaseUrl()}/identites/${encodeURIComponent(session.entity)}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(response.status === 401 ? 'SESSION_INVALIDE' : 'IDENTITE_INDISPONIBLE');
  }

  return response.json() as Promise<Record<string, unknown>>;
}

export async function closeUserSession(session: PortalAccountSession) {
  await fetch(`${coreBaseUrl()}/sessions/current`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.token}`,
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  }).catch(() => undefined);
}

export const portalAccountCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
  },
};
