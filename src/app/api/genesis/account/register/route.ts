import { NextResponse } from 'next/server';
import { CoreAccountError, createGamadAccount } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';
import { verifySimpleCaptcha } from '@/lib/simple-captcha';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    identifier?: string;
    password?: string;
    captchaToken?: string;
    captchaAnswer?: string;
  } | null;

  const name = body?.name?.trim();
  const identifier = body?.identifier?.trim();
  const password = body?.password;

  if (!name || !identifier || !password) {
    return NextResponse.json({ ok: false, error: 'DONNEES_REQUISES' }, { status: 422 });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, error: 'MOT_DE_PASSE_TROP_COURT' }, { status: 422 });
  }
  if (!verifySimpleCaptcha(body?.captchaToken, body?.captchaAnswer)) {
    return NextResponse.json({ ok: false, error: 'CAPTCHA_INCORRECT' }, { status: 422 });
  }

  try {
    const result = await createGamadAccount({ name, identifier, type: 'EMAIL', password });
    return NextResponse.json({
      ok: true,
      pending: {
        identity: result.identity,
        identifierReference: result.identifierReference,
        verificationReference: result.verificationReference,
        expiresAt: result.expiresAt,
        channel: result.channel,
      },
    }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof CoreAccountError) {
      const status = error.status === 409 ? 409 : error.status === 429 ? 429 : error.status >= 500 ? 503 : 422;
      return NextResponse.json({ ok: false, error: error.code }, { status, headers: { 'Cache-Control': 'no-store' } });
    }
    return NextResponse.json({ ok: false, error: 'CORE_TEMPORAIREMENT_INDISPONIBLE' }, { status: 503 });
  }
}
