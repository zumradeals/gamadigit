import { NextResponse } from 'next/server';
import { CoreAccountError, verifyGamadAccount } from '@/lib/gamad-core/account';
import { rejectCrossOrigin } from '@/lib/http/same-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const crossOrigin = rejectCrossOrigin(request);
  if (crossOrigin) return crossOrigin;

  const body = (await request.json().catch(() => null)) as {
    identity?: string;
    identifierReference?: string;
    verificationReference?: string;
    code?: string;
  } | null;

  if (!body?.identity || !body.identifierReference || !body.verificationReference || !body.code) {
    return NextResponse.json({ ok: false, error: 'DONNEES_REQUISES' }, { status: 422 });
  }

  try {
    await verifyGamadAccount({
      identity: body.identity,
      identifierReference: body.identifierReference,
      verificationReference: body.verificationReference,
      code: body.code.trim(),
    });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof CoreAccountError) {
      const status = error.status === 429 ? 429 : error.status >= 500 ? 503 : 422;
      return NextResponse.json({ ok: false, error: error.code }, { status, headers: { 'Cache-Control': 'no-store' } });
    }
    return NextResponse.json({ ok: false, error: 'VERIFICATION_INDISPONIBLE' }, { status: 503 });
  }
}
