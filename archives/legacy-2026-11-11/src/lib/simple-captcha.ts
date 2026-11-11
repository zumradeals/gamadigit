import 'server-only';

import crypto from 'node:crypto';

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const CAPTCHA_CONTEXT = 'dgafrique-simple-captcha-v1';

type CaptchaPayload = {
  left: number;
  right: number;
  expiresAt: number;
  nonce: string;
};

function signingSecret() {
  const secret = process.env.GAMAD_CORE_CONNECT_SECRET?.trim();
  if (!secret) throw new Error('GAMAD_CORE_CONNECT_SECRET manquant');
  return crypto.createHmac('sha256', secret).update(CAPTCHA_CONTEXT).digest();
}

function sign(payload: string) {
  return crypto.createHmac('sha256', signingSecret()).update(payload).digest('base64url');
}

export function createSimpleCaptcha() {
  const left = crypto.randomInt(1, 10);
  const right = crypto.randomInt(1, 10);
  const expiresAt = Date.now() + CAPTCHA_TTL_MS;
  const payload: CaptchaPayload = {
    left,
    right,
    expiresAt,
    nonce: crypto.randomBytes(12).toString('base64url'),
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');

  return {
    question: `${left} + ${right} = ?`,
    token: `${encoded}.${sign(encoded)}`,
    expiresAt: new Date(expiresAt).toISOString(),
  };
}

export function verifySimpleCaptcha(token: unknown, answer: unknown) {
  if (typeof token !== 'string' || typeof answer !== 'string') return false;
  const normalizedAnswer = answer.trim();
  if (!/^\d{1,3}$/.test(normalizedAnswer)) return false;

  const [encoded, suppliedSignature, extra] = token.split('.');
  if (!encoded || !suppliedSignature || extra) return false;

  const expectedSignature = sign(encoded);
  const supplied = Buffer.from(suppliedSignature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<CaptchaPayload>;
    if (!Number.isInteger(payload.left) || !Number.isInteger(payload.right) || !Number.isFinite(payload.expiresAt)) return false;
    if ((payload.expiresAt as number) <= Date.now()) return false;

    return Number(normalizedAnswer) === (payload.left as number) + (payload.right as number);
  } catch {
    return false;
  }
}
