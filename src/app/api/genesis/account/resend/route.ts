import { NextResponse } from 'next/server';
import { resendGamadVerification, type HumanIdentifierType } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    identifier?: string;
    type?: HumanIdentifierType;
    identifierReference?: string;
  } | null;

  const identifier = body?.identifier?.trim();
  const type = body?.type;
  const identifierReference = body?.identifierReference;

  if (!identifier || !identifierReference || !type || !['EMAIL', 'TELEPHONE'].includes(type)) {
    return NextResponse.json({ ok: false, error: 'DONNEES_REQUISES' }, { status: 422 });
  }

  try {
    const result = await resendGamadVerification({ identifier, type, identifierReference });
    return NextResponse.json({ ok: true, verification: result });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'RENVOI_INDISPONIBLE';
    const status = code === 'RENVOI_TROP_RAPIDE' || code === 'TROP_DE_RENVOIS' ? 429 : 422;
    return NextResponse.json({ ok: false, error: code }, { status });
  }
}
