import crypto from 'node:crypto';
import { coreFetch, coreProductRequest, getGamadCoreConfig } from '@/lib/gamad-core/server';

const COOKIE_NAME = 'dgafrique_gamad_session';

export type HumanIdentifierType = 'EMAIL' | 'TELEPHONE';

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

export type AccountCreationResult = {
  identity: string;
  identifierReference: string;
  verificationReference: string;
  expiresAt: string;
  channel: HumanIdentifierType;
};

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

export async function openUserSession(identifier: string, type: HumanIdentifierType, secret: string): Promise<PortalAccountSession> {
  const config = getGamadCoreConfig();
  const response = await coreFetch(`${config.baseUrl}/sessions`, {
    method: 'POST',
    body: JSON.stringify({ identifiant: identifier, type_identifiant: type, secret }),
  });
  const body = (await response.json().catch(() => ({}))) as CoreSession;
  if (!response.ok || !body.jeton || !body.entite || !body.expire_le) {
    throw new Error(response.status === 401 ? 'AUTHENTIFICATION_REFUSEE' : body.erreur || 'CORE_INDISPONIBLE');
  }

  return { token: body.jeton, entity: body.entite, assurance: body.assurance ?? null, expiresAt: body.expire_le };
}

export async function createGamadAccount(input: { name: string; identifier: string; type: HumanIdentifierType; password: string }): Promise<AccountCreationResult> {
  const response = await coreProductRequest('/comptes', {
    method: 'POST',
    body: JSON.stringify({
      nom: input.name,
      type_identifiant: input.type,
      identifiant: input.identifier,
      mot_de_passe: input.password,
    }),
  });
  const body = await response.json().catch(() => ({})) as {
    compte?: { identite?: string; identifiant_reference?: string };
    verification?: { reference?: string; expire_le?: string; livraison?: { livree?: boolean; canal?: string } };
    erreur?: string;
  };

  if (!response.ok || !body.compte?.identite || !body.compte.identifiant_reference || !body.verification?.reference || !body.verification.expire_le) {
    throw new Error(body.erreur || `CREATION_COMPTE_${response.status}`);
  }
  if (body.verification.livraison?.livree !== true) throw new Error('LIVRAISON_VERIFICATION_ECHOUEE');

  return {
    identity: body.compte.identite,
    identifierReference: body.compte.identifiant_reference,
    verificationReference: body.verification.reference,
    expiresAt: body.verification.expire_le,
    channel: input.type,
  };
}

export async function verifyGamadAccount(input: { identity: string; identifierReference: string; verificationReference: string; code: string }) {
  const response = await coreProductRequest('/comptes/verifications', {
    method: 'POST',
    body: JSON.stringify({
      identite: input.identity,
      identifiant_reference: input.identifierReference,
      verification_reference: input.verificationReference,
      code: input.code,
    }),
  });
  const body = await response.json().catch(() => ({})) as { identifiant?: { etat?: string }; erreur?: string };
  if (!response.ok || body.identifiant?.etat !== 'VERIFIE') throw new Error(body.erreur || `VERIFICATION_${response.status}`);
  return true;
}

export async function resendGamadVerification(input: { identifier: string; type: HumanIdentifierType; identifierReference: string }) {
  const response = await coreProductRequest('/comptes/verifications/renvoi', {
    method: 'POST',
    body: JSON.stringify({
      identifiant: input.identifier,
      type_identifiant: input.type,
      identifiant_reference: input.identifierReference,
    }),
  });
  const body = await response.json().catch(() => ({})) as { verification?: { reference?: string; expire_le?: string }; erreur?: string };
  if (!response.ok || !body.verification?.reference || !body.verification.expire_le) throw new Error(body.erreur || `RENVOI_${response.status}`);
  return { verificationReference: body.verification.reference, expiresAt: body.verification.expire_le };
}

export async function readCanonicalIdentity(session: PortalAccountSession) {
  const config = getGamadCoreConfig();
  const response = await coreFetch(`${config.baseUrl}/identites/${encodeURIComponent(session.entity)}`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'SESSION_INVALIDE' : 'IDENTITE_INDISPONIBLE');
  return response.json() as Promise<Record<string, unknown>>;
}

export async function closeUserSession(session: PortalAccountSession) {
  const config = getGamadCoreConfig();
  await coreFetch(`${config.baseUrl}/sessions/current`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${session.token}` },
  }).catch(() => undefined);
}

export const portalAccountCookie = {
  name: COOKIE_NAME,
  options: { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' },
};
