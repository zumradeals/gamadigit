import { NextResponse } from 'next/server';
import { verifyGamadAccount } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
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
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'VERIFICATION_INDISPONIBLE';
    return NextResponse.json({ ok: false, error: code }, { status: 422 });
  }
}
