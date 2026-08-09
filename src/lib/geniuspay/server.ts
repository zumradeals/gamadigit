import 'server-only';
import crypto from 'node:crypto';

const GENIUS_TIMEOUT_MS = 15_000;
const CURRENT_GENIUSPAY_BASE_URL = 'https://geniuspay.ci/api/v1/merchant';
const LEGACY_GENIUSPAY_BASE_URLS = new Set([
  'http://pay.genius.ci/api/v1/merchant',
  'https://pay.genius.ci/api/v1/merchant',
]);

export type GeniusPayStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export type GeniusPayment = {
  id?: number | string;
  reference: string;
  amount: number;
  fees?: number;
  netAmount?: number;
  status: GeniusPayStatus;
  environment?: string;
  checkoutUrl?: string;
  paymentUrl?: string;
  paymentMethod?: string;
  completedAt?: string | null;
  raw: Record<string, unknown>;
};

type GeniusConfig = {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string | null;
  environment: 'sandbox';
  membershipFeeXof: number;
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name}_MANQUANT`);
  return value;
}

function resolveGeniusBaseUrl() {
  const configured = (process.env.GENIUSPAY_BASE_URL || CURRENT_GENIUSPAY_BASE_URL).trim().replace(/\/$/, '');
  return LEGACY_GENIUSPAY_BASE_URLS.has(configured) ? CURRENT_GENIUSPAY_BASE_URL : configured;
}

export function getGeniusPayConfig(): GeniusConfig {
  const environment = (process.env.GENIUSPAY_ENVIRONMENT || 'sandbox').trim();
  if (environment !== 'sandbox') throw new Error('GENIUSPAY_SANDBOX_REQUIS');

  const apiKey = required('GENIUSPAY_API_KEY');
  const apiSecret = required('GENIUSPAY_API_SECRET');
  if (!apiKey.startsWith('pk_sandbox_') || !apiSecret.startsWith('sk_sandbox_')) {
    throw new Error('GENIUSPAY_CLES_SANDBOX_REQUISES');
  }

  const membershipFeeXof = Number.parseInt(process.env.ZUMRA_MEMBERSHIP_FEE_XOF || '500', 10);
  if (!Number.isFinite(membershipFeeXof) || membershipFeeXof < 200) {
    throw new Error('ZUMRA_MEMBERSHIP_FEE_XOF_INVALIDE');
  }

  return {
    baseUrl: resolveGeniusBaseUrl(),
    apiKey,
    apiSecret,
    webhookSecret: process.env.GENIUSPAY_WEBHOOK_SECRET?.trim() || null,
    environment: 'sandbox',
    membershipFeeXof,
  };
}

async function geniusFetch(path: string, init: RequestInit = {}) {
  const config = getGeniusPayConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GENIUS_TIMEOUT_MS);
  try {
    return await fetch(`${config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,
        'X-API-Secret': config.apiSecret,
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizePayment(raw: Record<string, unknown>): GeniusPayment {
  const reference = typeof raw.reference === 'string' ? raw.reference : '';
  const status = typeof raw.status === 'string' ? raw.status : '';
  const amount = typeof raw.amount === 'number' ? raw.amount : Number(raw.amount);
  if (!reference || !['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'].includes(status) || !Number.isFinite(amount)) {
    throw new Error('GENIUSPAY_REPONSE_INVALIDE');
  }

  const checkoutUrl = typeof raw.checkout_url === 'string' ? raw.checkout_url : undefined;
  const paymentUrl = typeof raw.payment_url === 'string' ? raw.payment_url : undefined;
  return {
    id: typeof raw.id === 'number' || typeof raw.id === 'string' ? raw.id : undefined,
    reference,
    amount,
    fees: typeof raw.fees === 'number' ? raw.fees : undefined,
    netAmount: typeof raw.net_amount === 'number' ? raw.net_amount : undefined,
    status: status as GeniusPayStatus,
    environment: typeof raw.environment === 'string' ? raw.environment : undefined,
    checkoutUrl,
    paymentUrl,
    paymentMethod: typeof raw.payment_method === 'string' ? raw.payment_method : undefined,
    completedAt: typeof raw.completed_at === 'string' ? raw.completed_at : null,
    raw,
  };
}

export async function createGeniusMembershipPayment(input: {
  coreIdentityReference: string;
  customerName?: string | null;
  customerPhone?: string | null;
  successUrl: string;
  errorUrl: string;
}) {
  const config = getGeniusPayConfig();
  const response = await geniusFetch('/payments', {
    method: 'POST',
    body: JSON.stringify({
      amount: config.membershipFeeXof,
      currency: 'XOF',
      description: 'Adhesion au Programme ZUMRA',
      customer: {
        ...(input.customerName ? { name: input.customerName } : {}),
        ...(input.customerPhone ? { phone: input.customerPhone } : {}),
      },
      success_url: input.successUrl,
      error_url: input.errorUrl,
      metadata: {
        purpose: 'zumra_membership',
        core_identity_reference: input.coreIdentityReference,
      },
    }),
  });
  const body = await response.json().catch(() => ({})) as { success?: boolean; data?: Record<string, unknown>; message?: string };
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.message || `GENIUSPAY_CREATION_${response.status}`);
  }
  const payment = normalizePayment(body.data);
  if (payment.environment && payment.environment !== 'sandbox') throw new Error('GENIUSPAY_ENVIRONNEMENT_INATTENDU');
  if (!payment.checkoutUrl && !payment.paymentUrl) throw new Error('GENIUSPAY_CHECKOUT_MANQUANT');
  return payment;
}

export async function getGeniusPayment(reference: string) {
  const response = await geniusFetch(`/payments/${encodeURIComponent(reference)}`);
  const body = await response.json().catch(() => ({})) as { success?: boolean; data?: Record<string, unknown>; message?: string };
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.message || `GENIUSPAY_LECTURE_${response.status}`);
  }
  const payment = normalizePayment(body.data);
  if (payment.reference !== reference) throw new Error('GENIUSPAY_REFERENCE_INCOHERENTE');
  if (payment.environment && payment.environment !== 'sandbox') throw new Error('GENIUSPAY_ENVIRONNEMENT_INATTENDU');
  return payment;
}

export function verifyGeniusWebhook(rawPayload: string, suppliedSignature: string | null) {
  const secret = getGeniusPayConfig().webhookSecret;
  if (!secret || !suppliedSignature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');
  const left = Buffer.from(suppliedSignature.trim().toLowerCase());
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
