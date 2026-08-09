import { coreFetch, coreProductRequest, getGamadCoreConfig } from '@/lib/gamad-core/server';
import {
  parsePortalSession,
  serializePortalSession,
  type PortalAccountSession,
} from '@/lib/gamad-core/portal-session';

export { parsePortalSession, serializePortalSession };
export type { PortalAccountSession };

const COOKIE_NAME = 'dgafrique_gamad_session';

export type HumanIdentifierType = 'EMAIL' | 'TELEPHONE';

export class CoreAccountError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
    this.name = 'CoreAccountError';
  }
}

type CoreSession = {
  jeton?: string;
  entite?: string;
  assurance?: string;
  expire_le?: string;
  erreur?: string;
  message?: string;
};

export type AccountCreationResult = {
  identity: string;
  identifierReference: string;
  verificationReference: string;
  expiresAt: string;
  channel: HumanIdentifierType;
};

export async function openUserSession(identifier: string, type: HumanIdentifierType, secret: string): Promise<PortalAccountSession> {
  const config = getGamadCoreConfig();
  const response = await coreFetch(`${config.baseUrl}/sessions`, {
    method: 'POST',
    body: JSON.stringify({ identifiant: identifier, type_identifiant: type, secret }),
  });
  const body = (await response.json().catch(() => ({}))) as CoreSession;
  if (!response.ok || !body.jeton || !body.entite || !body.expire_le) {
    throw new CoreAccountError(response.status === 401 ? 'AUTHENTIFICATION_REFUSEE' : body.erreur || 'CORE_INDISPONIBLE', response.status || 503);
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

  if (!response.ok) throw new CoreAccountError(body.erreur || `CREATION_COMPTE_${response.status}`, response.status);
  if (!body.compte?.identite || !body.compte.identifiant_reference || !body.verification?.reference || !body.verification.expire_le) {
    throw new CoreAccountError('REPONSE_COMPTE_INCOMPLETE', 502);
  }
  if (body.verification.livraison?.livree !== true) throw new CoreAccountError('LIVRAISON_VERIFICATION_ECHOUEE', 503);

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
  if (!response.ok) throw new CoreAccountError(body.erreur || `VERIFICATION_${response.status}`, response.status);
  if (body.identifiant?.etat !== 'VERIFIE') throw new CoreAccountError('VERIFICATION_INCOMPLETE', 502);
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
  if (!response.ok) throw new CoreAccountError(body.erreur || `RENVOI_${response.status}`, response.status);
  if (!body.verification?.reference || !body.verification.expire_le) throw new CoreAccountError('RENVOI_INCOMPLET', 502);
  return { verificationReference: body.verification.reference, expiresAt: body.verification.expire_le };
}

export async function readCanonicalIdentity(session: PortalAccountSession) {
  const config = getGamadCoreConfig();
  const response = await coreFetch(`${config.baseUrl}/identites/${encodeURIComponent(session.entity)}`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  if (!response.ok) throw new CoreAccountError(response.status === 401 ? 'SESSION_INVALIDE' : 'IDENTITE_INDISPONIBLE', response.status);
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
