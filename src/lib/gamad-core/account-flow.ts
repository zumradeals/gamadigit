export type PendingAccountVerification = {
  identity: string;
  identifierReference: string;
  verificationReference: string;
  expiresAt: string;
  channel: 'EMAIL';
  identifier: string;
};

const DEFAULT_RETURN_PATH = '/espace';

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
  ) {
    return null;
  }

  const expiresAt = Date.parse(input.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= nowMs) return null;

  return {
    identity: input.identity,
    identifierReference: input.identifierReference,
    verificationReference: input.verificationReference,
    expiresAt: input.expiresAt,
    channel: 'EMAIL',
    identifier: input.identifier.trim(),
  };
}
