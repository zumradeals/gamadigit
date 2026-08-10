import crypto from 'node:crypto';

export type PortalAccountSession = {
  token: string;
  entity: string;
  assurance: string | null;
  expiresAt: string;
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
  const [payload, suppliedSignature, extra] = value.split('.');
  if (!payload || !suppliedSignature || extra) return null;

  const expected = signature(payload);
  const left = Buffer.from(suppliedSignature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as PortalAccountSession;
    if (!parsed.token || !parsed.entity || !parsed.expiresAt) return null;
    const expiresAt = Date.parse(parsed.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}
