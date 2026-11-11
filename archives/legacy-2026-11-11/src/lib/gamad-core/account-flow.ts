export type PendingAccountVerification = {
  identity: string;
  identifierReference: string;
  verificationReference: string;
  expiresAt: string;
  channel: 'EMAIL';
  identifier: string;
  resumeUntil: string;
};

const DEFAULT_RETURN_PATH = '/espace';
export const PENDING_VERIFICATION_RESUME_MS = 7 * 24 * 60 * 60 * 1000;

export function safeAccountReturnPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_RETURN_PATH;
  }

  try {
    const base = new URL('https://dgafrique.local');
    const candidate = new URL(value, base);
    if (candidate.origin !== base.origin || candidate.pathname === '/connexion') {
      return DEFAULT_RETURN_PATH;
    }

    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return DEFAULT_RETURN_PATH;
  }
}

export function buildVerificationResendPayload(destination: string, identifierReference: string) {
  return {
    identifiant_reference: identifierReference,
    destination,
  };
}

export function makePendingAccountVerification(
  value: Omit<PendingAccountVerification, 'resumeUntil'>,
  nowMs = Date.now(),
): PendingAccountVerification {
  return {
    ...value,
    resumeUntil: new Date(nowMs + PENDING_VERIFICATION_RESUME_MS).toISOString(),
  };
}

export function normalizePendingAccountVerification(
  value: unknown,
  nowMs = Date.now(),
): PendingAccountVerification | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<PendingAccountVerification>;

  if (
    typeof input.identity !== 'string' || !input.identity.trim()
    || typeof input.identifierReference !== 'string' || !input.identifierReference.trim()
    || typeof input.verificationReference !== 'string' || !input.verificationReference.trim()
    || typeof input.expiresAt !== 'string' || !input.expiresAt.trim()
    || input.channel !== 'EMAIL'
    || typeof input.identifier !== 'string' || !input.identifier.trim()
    || typeof input.resumeUntil !== 'string' || !input.resumeUntil.trim()
  ) {
    return null;
  }

  const challengeExpiresAt = Date.parse(input.expiresAt);
  const resumeUntil = Date.parse(input.resumeUntil);
  if (!Number.isFinite(challengeExpiresAt) || !Number.isFinite(resumeUntil) || resumeUntil <= nowMs) return null;

  return {
    identity: input.identity,
    identifierReference: input.identifierReference,
    verificationReference: input.verificationReference,
    expiresAt: input.expiresAt,
    channel: 'EMAIL',
    identifier: input.identifier.trim(),
    resumeUntil: input.resumeUntil,
  };
}

export function pendingVerificationCodeIsActive(
  pending: Pick<PendingAccountVerification, 'expiresAt'>,
  nowMs = Date.now(),
): boolean {
  const expiresAt = Date.parse(pending.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt > nowMs;
}
